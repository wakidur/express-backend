(function () {
    angular.module("loc8rApp", ["ngRoute", "ngSanitize", "ui.bootstrap"]);

    function e(e, t) {
        e.when("/", {
            templateUrl: "/home/home.view.html",
            controller: "homeCtrl",
            controllerAs: "vm"
        }).when("/about", {
            templateUrl: "/common/views/genericText.view.html",
            controller: "aboutCtrl",
            controllerAs: "vm"
        }).when("/location/:locationid", {
            templateUrl: "/locationDetail/locationDetail.view.html",
            controller: "locationDetailCtrl",
            controllerAs: "vm"
        }).when("/register", {
            templateUrl: "/auth/register/register.view.html",
            controller: "registerCtrl",
            controllerAs: "vm"
        }).when("/login", {
            templateUrl: "/auth/login/login.view.html",
            controller: "loginCtrl",
            controllerAs: "vm"
        }).otherwise({
            redirectTo: "/"
        });
        t.html5Mode(true)
    }
    angular.module("loc8rApp").config(["$routeProvider", "$locationProvider", e])
})();
(function () {
    angular.module("loc8rApp").controller("homeCtrl", e);
    e.$inject = ["$scope", "loc8rData", "geolocation"];

    function e(e, t, o) {
        if (window.location.pathname !== "/") {
            window.location.href = "/#" + window.location.pathname
        }
        var n = this;
        console.log(window.location);
        n.pageHeader = {
            title: "Loc8r",
            strapline: "Find places to work with wifi near you!"
        };
        n.sidebar = {
            content: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for."
        };
        n.message = "Checking your location";
        n.getData = function (e) {
            var o = e.coords.latitude,
                r = e.coords.longitude;
            n.message = "Searching for nearby places";
            t.locationByCoords(o, r).success(function (e) {
                n.message = e.length > 0 ? "" : "No locations found nearby";
                n.data = {
                    locations: e
                };
                console.log(n.data)
            }).error(function (e) {
                n.message = "Sorry, something's gone wrong, please try again later"
            })
        };
        n.showError = function (t) {
            e.$apply(function () {
                n.message = t.message
            })
        };
        n.noGeo = function () {
            e.$apply(function () {
                n.message = "Geolocation is not supported by this browser."
            })
        };
        o.getPosition(n.getData, n.showError, n.noGeo)
    }
})();
(function () {
    angular.module("loc8rApp").controller("aboutCtrl", e);

    function e() {
        var e = this;
        e.pageHeader = {
            title: "About Loc8r"
        };
        e.main = {
            content: "Loc8r was created to help people find places to sit down and get a bit of work done.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed lorem ac nisi dignissim accumsan. Nullam sit amet interdum magna. Morbi quis faucibus nisi. Vestibulum mollis purus quis eros adipiscing tristique. Proin posuere semper tellus, id placerat augue dapibus ornare. Aenean leo metus, tempus in nisl eget, accumsan interdum dui. Pellentesque sollicitudin volutpat ullamcorper.\n\nSuspendisse tincidunt, lectus non suscipit pharetra, purus ipsum vehicula sapien, a volutpat mauris ligula vel dui. Proin varius interdum elit, eu porttitor quam consequat et. Quisque vitae felis sed ante fringilla fermentum in vitae sem. Quisque fermentum metus at neque sagittis imperdiet. Phasellus non laoreet massa, eu laoreet nibh. Pellentesque vel magna vulputate, porta augue vel, dapibus nisl. Phasellus aliquet nibh nec nunc posuere fringilla. Quisque sit amet dignissim erat. Nulla facilisi. Donec in sollicitudin ante. Cras rhoncus accumsan rutrum. Sed aliquet ligula dui, eget laoreet turpis tempor vitae."
        }
    }
})();
(function () {
    angular.module("loc8rApp").controller("loginCtrl", e);
    e.$inject = ["$location", "authentication"];

    function e(e, t) {
        var o = this;
        o.pageHeader = {
            title: "Sign in to Loc8r"
        };
        o.credentials = {
            email: "",
            password: ""
        };
        o.returnPage = e.search().page || "/";
        o.onSubmit = function () {
            o.formError = "";
            if (!o.credentials.email || !o.credentials.password) {
                o.formError = "All fields required, please try again";
                return false
            } else {
                o.doLogin()
            }
        };
        o.doLogin = function () {
            o.formError = "";
            t.login(o.credentials).error(function (e) {
                o.formError = e
            }).then(function () {
                e.search("page", null);
                e.path(o.returnPage)
            })
        }
    }
})();
(function () {
    angular.module("loc8rApp").controller("registerCtrl", e);
    e.$inject = ["$location", "authentication"];

    function e(e, t) {
        var o = this;
        o.pageHeader = {
            title: "Create a new Loc8r account"
        };
        o.credentials = {
            name: "",
            email: "",
            password: ""
        };
        o.returnPage = e.search().page || "/";
        o.onSubmit = function () {
            o.formError = "";
            if (!o.credentials.name || !o.credentials.email || !o.credentials.password) {
                o.formError = "All fields required, please try again";
                return false
            } else {
                o.doRegister()
            }
        };
        o.doRegister = function () {
            o.formError = "";
            t.register(o.credentials).error(function (e) {
                o.formError = e
            }).then(function () {
                e.search("page", null);
                e.path(o.returnPage)
            })
        }
    }
})();
(function () {
    angular.module("loc8rApp").controller("locationDetailCtrl", e);
    e.$inject = ["$routeParams", "$location", "$modal", "loc8rData", "authentication"];

    function e(e, t, o, n, r) {
        var i = this;
        i.locationid = e.locationid;
        i.isLoggedIn = r.isLoggedIn();
        i.currentPath = t.path();
        n.locationById(i.locationid).success(function (e) {
            i.data = {
                location: e
            };
            i.pageHeader = {
                title: i.data.location.name
            }
        }).error(function (e) {
            console.log(e)
        });
        i.popupReviewForm = function () {
            var e = o.open({
                templateUrl: "/reviewModal/reviewModal.view.html",
                controller: "reviewModalCtrl as vm",
                resolve: {
                    locationData: function () {
                        return {
                            locationid: i.locationid,
                            locationName: i.data.location.name
                        }
                    }
                }
            });
            e.result.then(function (e) {
                i.data.location.reviews.push(e)
            })
        }
    }
})();
(function () {
    angular.module("loc8rApp").controller("reviewModalCtrl", e);
    e.$inject = ["$modalInstance", "loc8rData", "locationData"];

    function e(e, t, o) {
        var n = this;
        n.locationData = o;
        n.onSubmit = function () {
            n.formError = "";
            if (!n.formData.rating || !n.formData.reviewText) {
                n.formError = "All fields required, please try again";
                return false
            } else {
                n.doAddReview(n.locationData.locationid, n.formData)
            }
        };
        n.doAddReview = function (e, o) {
            t.addReviewById(e, {
                rating: o.rating,
                reviewText: o.reviewText
            }).success(function (e) {
                n.modal.close(e)
            }).error(function (e) {
                n.formError = "Your review has not been saved, please try again"
            });
            return false
        };
        n.modal = {
            close: function (t) {
                e.close(t)
            },
            cancel: function () {
                e.dismiss("cancel")
            }
        }
    }
})();
(function () {
    angular.module("loc8rApp").service("authentication", e);
    e.$inject = ["$http", "$window"];

    function e(e, t) {
        var o = function (e) {
            t.localStorage["loc8r-token"] = e
        };
        var n = function () {
            return t.localStorage["loc8r-token"]
        };
        var r = function () {
            var e = n();
            if (e) {
                var o = JSON.parse(t.atob(e.split(".")[1]));
                return o.exp > Date.now() / 1e3
            } else {
                return false
            }
        };
        var i = function () {
            if (r()) {
                var e = n();
                var o = JSON.parse(t.atob(e.split(".")[1]));
                return {
                    email: o.email,
                    name: o.name
                }
            }
        };
        register = function (t) {
            return e.post("/api/register", t).success(function (e) {
                o(e.token)
            })
        };
        login = function (t) {
            return e.post("/api/login", t).success(function (e) {
                o(e.token)
            })
        };
        logout = function () {
            t.localStorage.removeItem("loc8r-token")
        };
        return {
            currentUser: i,
            saveToken: o,
            getToken: n,
            isLoggedIn: r,
            register: register,
            login: login,
            logout: logout
        }
    }
})();
(function () {
    angular.module("loc8rApp").service("geolocation", e);

    function e() {
        var e = function (e, t, o) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(e, t)
            } else {
                o()
            }
        };
        return {
            getPosition: e
        }
    }
})();
(function () {
    angular.module("loc8rApp").service("loc8rData", e);
    e.$inject = ["$http", "authentication"];

    function e(e, t) {
        var o = function (t, o) {
            return e.get("/api/locations?lng=" + o + "&lat=" + t + "&maxDistance=20")
        };
        var n = function (t) {
            return e.get("/api/locations/" + t)
        };
        var r = function (o, n) {
            return e.post("/api/locations/" + o + "/reviews", n, {
                headers: {
                    Authorization: "Bearer " + t.getToken()
                }
            })
        };
        return {
            locationByCoords: o,
            locationById: n,
            addReviewById: r
        }
    }
})();
(function () {
    angular.module("loc8rApp").filter("formatDistance", t);
    var e = function (e) {
        return !isNaN(parseFloat(e)) && isFinite(e)
    };

    function t() {
        return function (t) {
            var o, n;
            if (t && e(t)) {
                if (t > 1) {
                    o = parseFloat(t).toFixed(1);
                    n = "km"
                } else {
                    o = parseInt(t * 1e3, 10);
                    n = "m"
                }
                return o + n
            } else {
                return "?"
            }
        }
    }
})();
(function () {
    angular.module("loc8rApp").filter("addHtmlLineBreaks", e);

    function e() {
        return function (e) {
            var t = e.replace(/\n/g, "<br/>");
            return t
        }
    }
})();
(function () {
    angular.module("loc8rApp").controller("navigationCtrl", e);
    e.$inject = ["$location", "authentication"];

    function e(e, t) {
        var o = this;
        o.currentPath = e.path();
        o.isLoggedIn = t.isLoggedIn();
        o.currentUser = t.currentUser();
        o.logout = function () {
            t.logout();
            e.path("/")
        }
    }
})();
(function () {
    angular.module("loc8rApp").directive("navigation", e);

    function e() {
        return {
            restrict: "EA",
            templateUrl: "/common/directives/navigation/navigation.template.html",
            controller: "navigationCtrl as navvm"
        }
    }
})();
(function () {
    angular.module("loc8rApp").directive("footerGeneric", e);

    function e() {
        return {
            restrict: "EA",
            templateUrl: "/common/directives/footerGeneric/footerGeneric.template.html"
        }
    }
})();
(function () {
    angular.module("loc8rApp").directive("pageHeader", e);

    function e() {
        return {
            restrict: "EA",
            scope: {
                content: "=content"
            },
            templateUrl: "/common/directives/pageHeader/pageHeader.template.html"
        }
    }
})();
(function () {
    angular.module("loc8rApp").directive("ratingStars", e);

    function e() {
        return {
            restrict: "EA",
            scope: {
                thisRating: "=rating"
            },
            templateUrl: "/common/directives/ratingStars/ratingStars.template.html"
        }
    }
})();