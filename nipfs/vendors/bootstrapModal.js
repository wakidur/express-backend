angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.transition", "ui.bootstrap.modal"]);
angular.module("ui.bootstrap.tpls", ["views/modal/backdrop.html", "views/modal/window.html"]);
angular.module('ui.bootstrap.transition', [])

/**
 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
 * @param  {DOMElement} element  The DOMElement that will be animated.
 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
 *   - As a string, it represents the css class to be added to the element.
 *   - As an object, it represents a hash of style attributes to be applied to the element.
 *   - As a function, it represents a function to be called that will cause the transition to occur.
 * @return {Promise}  A promise that is resolved when the transition finishes.
 */
.factory('$transition', ['$q', '$timeout', '$rootScope', function ($q, $timeout, $rootScope) {

    var $transition = function (element, trigger, options) {
        options = options || {};
        var deferred = $q.defer();
        var endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"];

        var transitionEndHandler = function (event) {
            $rootScope.$apply(function () {
                element.unbind(endEventName, transitionEndHandler);
                deferred.resolve(element);
            });
        };

        if (endEventName) {
            element.bind(endEventName, transitionEndHandler);
        }

        // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
        $timeout(function () {
            if (angular.isString(trigger)) {
                element.addClass(trigger);
            } else if (angular.isFunction(trigger)) {
                trigger(element);
            } else if (angular.isObject(trigger)) {
                element.css(trigger);
            }
            //If browser does not support transitions, instantly resolve
            if (!endEventName) {
                deferred.resolve(element);
            }
        });

        // Add our custom cancel function to the promise that is returned
        // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
        // i.e. it will therefore never raise a transitionEnd event for that transition
        deferred.promise.cancel = function () {
            if (endEventName) {
                element.unbind(endEventName, transitionEndHandler);
            }
            deferred.reject('Transition cancelled');
        };

        return deferred.promise;
    };

    // Work out the name of the transitionEnd event
    var transElement = document.createElement('trans');
    var transitionEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'transition': 'transitionend'
    };
    var animationEndEventNames = {
        'WebkitTransition': 'webkitAnimationEnd',
        'MozTransition': 'animationend',
        'OTransition': 'oAnimationEnd',
        'transition': 'animationend'
    };
    function findEndEventName(endEventNames) {
        for (var name in endEventNames) {
            if (transElement.style[name] !== undefined) {
                return endEventNames[name];
            }
        }
    }
    $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
    $transition.animationEndEventName = findEndEventName(animationEndEventNames);
    return $transition;
}]);


angular.module('ui.bootstrap.modal', [])

/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function () {
      return {
          createNew: function () {
              var stack = [];

              return {
                  add: function (key, value) {
                      stack.push({
                          key: key,
                          value: value
                      });
                  },
                  get: function (key) {
                      for (var i = 0; i < stack.length; i++) {
                          if (key == stack[i].key) {
                              return stack[i];
                          }
                      }
                  },
                  top: function () {
                      return stack[stack.length - 1];
                  },
                  remove: function (key) {
                      var idx = -1;
                      for (var i = 0; i < stack.length; i++) {
                          if (key == stack[i].key) {
                              idx = i;
                              break;
                          }
                      }
                      return stack.splice(idx, 1)[0];
                  },
                  removeTop: function () {
                      return stack.splice(stack.length - 1, 1)[0];
                  },
                  length: function () {
                      return stack.length;
                  }
              };
          }
      };
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('modalBackdrop', ['$modalStack', '$timeout', function ($modalStack, $timeout) {
      return {
          restrict: 'EA',
          scope: {},
          replace: true,
          templateUrl: 'views/modal/backdrop.html',
          link: function (scope, element, attrs) {

              //trigger CSS transitions
              $timeout(function () {
                  scope.animate = true;
              });

              scope.close = function (evt) {
                  window.console.log('expression');
                  var modal = $modalStack.getTop();
                  //TODO: this logic is duplicated with the place where modal gets opened
                  if (modal && modal.window.backdrop && modal.window.backdrop != 'static') {
                      evt.preventDefault();
                      evt.stopPropagation();
                      $modalStack.dismiss(modal.instance, 'backdrop click');
                  }
              };
          }
      };
  }])

  .directive('modalWindow', ['$timeout', function ($timeout) {
      return {
          restrict: 'EA',
          scope: {},
          replace: true,
          transclude: true,
          templateUrl: 'views/modal/window.html',
          link: function (scope, element, attrs) {
              //trigger CSS transitions
              $timeout(function () {
                  scope.animate = true;
              });
          }
      };
  }])

  .factory('$modalStack', ['$document', '$compile', '$rootScope', '$$stackedMap',
    function ($document, $compile, $rootScope, $$stackedMap) {

        var body = $document.find('body').eq(0);
        var openedWindows = $$stackedMap.createNew();
        var $modalStack = {};

        function removeModalWindow(modalInstance) {

            var modalWindow = openedWindows.get(modalInstance).value;

            //clean up the stack
            openedWindows.remove(modalInstance);

            if (openedWindows.length() === 0) {
                body.removeClass('modal-open');
            }

            //remove DOM element
            modalWindow.modalDomEl.remove();

            //remove backdrop
            if (modalWindow.backdropDomEl) {
                modalWindow.backdropDomEl.remove();
            }

            //destroy scope
            modalWindow.modalScope.$destroy();
        }

        $document.bind('keydown', function (evt) {
            var modal;

            if (evt.which === 27) {
                modal = openedWindows.top();
                if (modal && modal.value.keyboard) {
                    $rootScope.$apply(function () {
                        $modalStack.dismiss(modal.key);
                    });
                }
            }
        });

        $modalStack.open = function (modalInstance, modal) {

            var backdropDomEl;
            if (modal.backdrop) {
                backdropDomEl = $compile(angular.element('<modal-backdrop>'))($rootScope);
                body.append(backdropDomEl);
            }
            var modalDomEl = $compile(angular.element('<modal-window>').html(modal.content))(modal.scope);
            body.append(modalDomEl);

            if (openedWindows.length() === 0) {
                body.addClass('modal-open');
            }

            openedWindows.add(modalInstance, {
                deferred: modal.deferred,
                modalScope: modal.scope,
                modalDomEl: modalDomEl,
                backdrop: modal.backdrop,
                backdropDomEl: backdropDomEl,
                keyboard: modal.keyboard
            });
        };

        $modalStack.close = function (modalInstance, result) {
            var modal = openedWindows.get(modalInstance);
            if (modal) {
                modal.value.deferred.resolve(result);
                removeModalWindow(modalInstance);
            }
        };

        $modalStack.dismiss = function (modalInstance, reason) {
            var modalWindow = openedWindows.get(modalInstance).value;
            if (modalWindow) {
                modalWindow.deferred.reject(reason);
                removeModalWindow(modalInstance);
            }
        };

        $modalStack.getTop = function () {
            var top = openedWindows.top();
            if (top) {
                return {
                    instance: top.key,
                    window: top.value
                };
            }
        };

        return $modalStack;
    }])

  .provider('$modal', function () {

      var defaultOptions = {
          backdrop: true, //can be also false or 'static'
          keyboard: true
      };

      return {
          options: defaultOptions,
          $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
            function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

                var $modal = {};

                function getTemplatePromise(options) {
                    return options.template ? $q.when(options.template) :
                      $http.get(options.templateUrl, { cache: $templateCache }).then(function (result) {
                          return result.data;
                      });
                }

                function getResolvePromises(resolves) {
                    var promisesArr = [];
                    angular.forEach(resolves, function (value, key) {
                        if (angular.isFunction(value) || angular.isArray(value)) {
                            promisesArr.push($q.when($injector.invoke(value)));
                        }
                    });
                    return promisesArr;
                }

                $modal.open = function (modalOptions) {

                    var modalResultDeferred = $q.defer();
                    var modalOpenedDeferred = $q.defer();

                    //prepare an instance of a modal to be injected into controllers and returned to a caller
                    var modalInstance = {
                        result: modalResultDeferred.promise,
                        opened: modalOpenedDeferred.promise,
                        close: function (result) {
                            $modalStack.close(this, result);
                        },
                        dismiss: function (reason) {
                            $modalStack.dismiss(this, reason);
                        }
                    };

                    //merge and clean up options
                    //modalOptions = angular.extend(angular.copy(defaultOptions), modalOptions);
                    modalOptions = angular.extend(defaultOptions, modalOptions);
                    modalOptions.resolve = modalOptions.resolve || {};

                    //verify options
                    if (!modalOptions.template && !modalOptions.templateUrl) {
                        throw new Error('One of template or templateUrl options is required.');
                    }

                    var templateAndResolvePromise =
                      $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


                    templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

                        var modalScope = (modalOptions.scope || $rootScope).$new();

                        var ctrlInstance, ctrlLocals = {};
                        var resolveIter = 1;

                        //controllers
                        if (modalOptions.controller) {
                            ctrlLocals.$scope = modalScope;
                            ctrlLocals.$modalInstance = modalInstance;
                            angular.forEach(modalOptions.resolve, function (value, key) {
                                ctrlLocals[key] = tplAndVars[resolveIter++];
                            });

                            ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                        }

                        $modalStack.open(modalInstance, {
                            scope: modalScope,
                            deferred: modalResultDeferred,
                            content: tplAndVars[0],
                            backdrop: modalOptions.backdrop,
                            keyboard: modalOptions.keyboard
                        });

                    }, function resolveError(reason) {
                        modalResultDeferred.reject(reason);
                    });

                    templateAndResolvePromise.then(function () {
                        modalOpenedDeferred.resolve(true);
                    }, function () {
                        modalOpenedDeferred.reject(false);
                    });

                    return modalInstance;
                };

                return $modal;
            }]
      };
  });




angular.module("views/modal/backdrop.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("views/modal/backdrop.html",
      "<div class=\"modal-backdrop fade\" ng-class=\"{in: animate}\" ng-click=\"close($event)\"></div>"
      );
}]);

angular.module("views/modal/window.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("views/modal/window.html",
      "<div class=\"modal fade\" ng-class=\"{in: animate}\" ng-transclude></div>"
      );
}]);

