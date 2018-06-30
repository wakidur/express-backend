(function(){
    'use strict';

    angular
        .module('app')
        .controller('applicationCtrl', constructor);

        constructor.$inject = ['$scope', 'applicationModelSvc', 'applicationDataSvc'];

    function constructor($scope, modelSvc, dataSvc) {
        /* jshint validthis:true */
        // var vm = this;
        // scope variable
        var vm = $scope;

        // variable binding  
        vm.application = {}; // main object for applicaiton 
        vm.serverDataList = []; // server data 
        vm.applicationList = []; // data for showing grid view 
        vm.isCancelBtnShow = false; // cancel button show hide 
        vm.tempApplication = {};

        // method binding 
        vm.submitForm = submitForm;
        vm.edit = edit;
        vm.deleteApplication = deleteApplication;
        vm.reset = reset;
        vm.cancel = cancel;

        // initialize 
        activate();

        // initialize 
        function activate() { 
            try {
                // application page  initialization
                _initApplication();

                // get server data 
                getServerData();
            } catch (error) {
                showErrorMsg(error);
            }
        }

        // initialize application
        function _initApplication() {
            try {
                // initialize new application
                vm.application = new application();
                vm.tempApplication = {}; // hold temp object 
                vm.isCancelBtnShow = false;

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get server data 
        function getServerData() {
            try {
                var tick = (new Date()).getTime().toString();
                dataSvc.getApplication(tick).then(function (result) {
                    // get flat object array list 
                    vm.serverDataList = angular.copy(result);

                    // prepare gird view and pagination
                    search(vm.serverDataList);
                });

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // save data to server 
        function submitForm() {
            try {
                if (!vm.application._id) { // insert new application 
                    if (!modelSvc.chcekdDuplicate(vm.application, vm.serverDataList)) {
                        dataSvc.saveOrUpdateEntity(vm.application).then(function (result) {
                            _afterSave(result.data);
                        });
                    } else {
                        showDuplicateMsg(); // show duplicate message found 
                    }
                } else { // update application
                    if (!modelSvc.chcekdDuplicate(vm.application, vm.serverDataList, vm.tempApplication)) {
                        dataSvc.saveOrUpdateEntity(vm.application).then(function (result) {
                            _afterUpdate(result.data);
                        });
                    } else {
                        showDuplicateMsg(); // show duplicate message found 
                    }
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // delete application
        function deleteApplication(entity) {
            try {
                var result = confirm("Are you sure you want to delete permamently?If yes, press ok.");
                if (result) {
                    dataSvc.deleteApp(entity).then(function (success) {

                        if (success.data.isExist == true) {
                            usagesAnotherScopeMsg();
                        } else {
                            vm.isPaginationOptionChange = false;
                            // return deletedData;
                            if (vm.tempApplication._id == entity._id) {
                                // application page  initialization
                                _initApplication();

                                vm.applicationForm.$setPristine();
                            }
                            _updateGridData(entity);

                            showSuccessDeletedMsg();
                        }
                    }).catch(function (e) {
                        showErrorMsg(e);
                    });
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // update grid data after delete entity
        function _updateGridData(entity) {
            try {
                var index = vm.serverDataList.indexOf(entity);
                if (index > -1)
                    vm.serverDataList.splice(index, 1);

                // update grid data view 
                search(vm.serverDataList);

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // edit application 
        function edit(entity) {
            try {
                vm.application = angular.copy(entity);

                // hold data into temp object
                vm.tempApplication = angular.copy(entity);

                // show cancel button 
                vm.isCancelBtnShow = true;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // reset page 
        function reset() {
            try {
                // assaign old object temp Object property 
                vm.application = angular.copy(vm.tempApplication);
                // rest form 
                vm.applicationForm.$setPristine();
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // cancel action 

        function cancel() {
            try {
                // application page  initialization
                _initApplication();

            } catch (e) {
                showErrorMsg(e);
            }
        }


        // after save operation 
        function _afterSave(entity) {
            try {
                // add new entity into list 
                vm.serverDataList.push(entity);

                // prepare gird view and pagination
                search(vm.serverDataList);

                // initialize application page 
                _initApplication();

                showSuccessSaveMsg(); // show sucess message 

                vm.applicationForm.$setPristine(); // reset form 
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // after update 
        function _afterUpdate(entity) {
            try {
                var appObject = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                    return x._id == entity._id;
                });
                if (appObject) {
                    appObject.name = entity.name;
                    appObject.shortName = entity.shortName;
                }


                // grid data update 
                search(vm.serverDataList);

                // initialze page 
                _initApplication();

                vm.applicationForm.$setPristine(); // reset form 

                showSuccessUpdateMsg(); // show sucessfully updated message 
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // pagination custom criteria
        vm.criteria = {
            page: 1, // no. of page 
            pagesize: 10, // showing data into one page 

        };

        // vm.paginationPageNo = vm.criteria.page;
        vm.paging = {
            total: 0,
            totalpages: 0,
            fromShowing: 0,
            toShowing: 0,
            pagingOptions: [], // page size 
            tempPaginationOption: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800] // temp page size 
        };


        // watch call when any critera property has changed
        var watchData = vm.$watch('criteria', function (newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                if (newValue.page <= vm.paging.totalpages) {
                    search(vm.serverDataList);
                } else {
                    vm.criteria.page = 1;
                }
            }
        }, true);

        function search(flatObjectArrayList) {
            try {


                // set order 
                flatObjectArrayList = Enumerable.From(flatObjectArrayList).Where(function (x) {
                    return x;
                }).OrderBy("$.name").ToArray();

                vm.paging.total = flatObjectArrayList.length;
                if (!vm.isPaginationOptionChange)
                    vm.criteria.pagesize = 10; // set default page size */

                vm.paging.totalpages = (Math.ceil(flatObjectArrayList.length / vm.criteria.pagesize)) == 0 ? 1 : (Math.ceil(flatObjectArrayList.length / vm.criteria.pagesize));

                // set pagination option 
                if (!vm.isPaginationOptionChange) {
                    vm.paging.pagingOptions.length = 0;
                    for (var i = 0; i < vm.paging.totalpages; i++) {
                        if (vm.paging.tempPaginationOption.length > i)
                            vm.paging.pagingOptions.push(vm.paging.tempPaginationOption[i]);
                    }
                    vm.isPaginationOptionChange = true;
                }

                _getGridViewList(flatObjectArrayList, vm.criteria);

            } catch (e) {
                showErrorMsg(e);
            }
        }

        function _getGridViewList(list, entity) {
            try {
                vm.applicationList.length = 0;

                // if entity is undefined 
                vm.applicationList = getFileterData(list, entity);
            } catch (e) {
                showErrorMsg(e);
            }
        }


        function getFileterData(list, entity) {
            try {
                var dataList = [];

                if (!entity.page || entity.page == 1) {
                    var pageNo = !entity.page ? 1 : entity.page;

                    if (list.length >= 10) {
                        vm.paging.fromShowing = 1;
                        if (list.length < entity.pagesize) {
                            vm.paging.toShowing = list.length;
                        } else {
                            vm.paging.toShowing = entity.pagesize;
                        }
                    } else if (list.length == 0) {

                        vm.paging.fromShowing = 0;
                        vm.paging.toShowing = 0;
                    }
                    for (var i = 0; i < list.length; i++) {
                        if (i < pageNo * entity.pagesize) {
                            dataList.push(list[i]);
                        }
                    }
                    if (list.length < 10 && list.length != 0) {
                        vm.paging.fromShowing = 1;
                        vm.paging.toShowing = dataList.length;
                    }
                } else {
                    if (entity.page <= vm.paging.totalpages) {
                        var fromPageNo = (entity.page * entity.pagesize) - entity.pagesize + 1;
                        var tempToPageNo = fromPageNo + entity.pagesize;

                        for (var k = fromPageNo; k < tempToPageNo; k++) {
                            if (list[k - 1]) {
                                dataList.push(list[k - 1]);
                            }
                        }
                        vm.paging.fromShowing = fromPageNo;
                        vm.paging.toShowing = fromPageNo + dataList.length - 1;
                    }
                }
                return dataList;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // show first page data 
        vm.pageniToFirst = function () {
            try {
                // if (vm.criteria.page > 1 && !vm.criteria.page)
                if (vm.criteria.page > 1)
                    vm.criteria.page = 1;
            } catch (e) {
                showErrorMsg(e);
            }

        };

        // back to page 
        vm.pageniBackward = function () {
            try {
                if (vm.criteria.page && vm.criteria.page > 1) {
                    if (vm.criteria.page <= vm.paging.totalpages)
                        vm.criteria.page = vm.criteria.page - 1;
                }
            } catch (e) {
                showErrorMsg(e);
            }
        };

        // forward to page  
        vm.pageniForward = function () {
            try {
                if (vm.criteria.page < vm.paging.totalpages) {
                    vm.criteria.page = vm.criteria.page + 1;
                }
            } catch (e) {
                showErrorMsg(e);
            }
        };

        // show last page data 
        vm.pageniToLast = function () {
            try {
                if (vm.criteria.page < vm.paging.totalpages) {
                    vm.criteria.page = vm.paging.totalpages;
                }
            } catch (e) {
                showErrorMsg(e);
            }
        };

        // object defination 
        function application(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null;
            this.name = defaultData.name || null;
            this.shortName = defaultData.shortName || null;
        }

    }
})();

// var app = angular.module('app');

// app.controller('applicationCtrl', ['$scope', 'applicationModelSvc', 'applicationDataSvc',
//     function ($scope, modelSvc, dataSvc) {

//         // scope variable
//         var vm = $scope;

//         // variable binding  
//         vm.application = {}; // main object for applicaiton 
//         vm.serverDataList = []; // server data 
//         vm.applicationList = []; // data for showing grid view 
//         vm.isCancelBtnShow = false; // cancel button show hide 
//         vm.tempApplication = {};

//         // method binding 
//         vm.submitForm = submitForm;
//         vm.edit = edit;
//         vm.deleteApplication = deleteApplication;
//         vm.reset = reset;
//         vm.cancel = cancel;

//         // initialize 
//         _int();

//         function _int() {
//             try {
//                 // application page  initialization
//                 _initApplication();

//                 // get server data 
//                 getServerData();
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         // initialize application
//         function _initApplication() {
//             try {
//                 // initialize new application
//                 vm.application = new application();
//                 vm.tempApplication = {}; // hold temp object 
//                 vm.isCancelBtnShow = false;

//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         // get server data 
//         function getServerData() {
//             try {
//                 var tick = (new Date()).getTime().toString();
//                 dataSvc.getApplication(tick).then(function (result) {
//                     // get flat object array list 
//                     vm.serverDataList = angular.copy(result);

//                     // prepare gird view and pagination
//                     search(vm.serverDataList);
//                 });

//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         // save data to server 
//         function submitForm() {
//             try {
//                 if (!vm.application._id) { // insert new application 
//                     if (!modelSvc.chcekdDuplicate(vm.application, vm.serverDataList)) {
//                         dataSvc.saveOrUpdateEntity(vm.application).then(function (result) {
//                             _afterSave(result.data);
//                         });
//                     } else {
//                         showDuplicateMsg(); // show duplicate message found 
//                     }
//                 } else { // update application
//                     if (!modelSvc.chcekdDuplicate(vm.application, vm.serverDataList, vm.tempApplication)) {
//                         dataSvc.saveOrUpdateEntity(vm.application).then(function (result) {
//                             _afterUpdate(result.data);
//                         });
//                     } else {
//                         showDuplicateMsg(); // show duplicate message found 
//                     }
//                 }
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         // delete application
//         function deleteApplication(entity) {
//             try {
//                 var result = confirm("Are you sure you want to delete permamently?If yes, press ok.");
//                 if (result) {
//                     dataSvc.deleteApp(entity).then(function (success) {

//                         if (success.data.isExist == true) {
//                             usagesAnotherScopeMsg();
//                         } else {
//                             vm.isPaginationOptionChange = false;
//                             // return deletedData;
//                             if (vm.tempApplication._id == entity._id) {
//                                 // application page  initialization
//                                 _initApplication();

//                                 vm.applicationForm.$setPristine();
//                             }
//                             _updateGridData(entity);

//                             showSuccessDeletedMsg();
//                         }
//                     }).catch(function (e) {
//                         showErrorMsg(e);
//                     });
//                 }
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         // update grid data after delete entity
//         function _updateGridData(entity) {
//             try {
//                 var index = vm.serverDataList.indexOf(entity);
//                 if (index > -1)
//                     vm.serverDataList.splice(index, 1);

//                 // update grid data view 
//                 search(vm.serverDataList);

//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         // edit application 
//         function edit(entity) {
//             try {
//                 vm.application = angular.copy(entity);

//                 // hold data into temp object
//                 vm.tempApplication = angular.copy(entity);

//                 // show cancel button 
//                 vm.isCancelBtnShow = true;
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         // reset page 
//         function reset() {
//             try {
//                 // assaign old object temp Object property 
//                 vm.application = angular.copy(vm.tempApplication);
//                 // rest form 
//                 vm.applicationForm.$setPristine();
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         // cancel action 

//         function cancel() {
//             try {
//                 // application page  initialization
//                 _initApplication();

//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }


//         // after save operation 
//         function _afterSave(entity) {
//             try {
//                 // add new entity into list 
//                 vm.serverDataList.push(entity);

//                 // prepare gird view and pagination
//                 search(vm.serverDataList);

//                 // initialize application page 
//                 _initApplication();

//                 showSuccessSaveMsg(); // show sucess message 

//                 vm.applicationForm.$setPristine(); // reset form 
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         // after update 
//         function _afterUpdate(entity) {
//             try {
//                 var appObject = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
//                     return x._id == entity._id;
//                 });
//                 if (appObject) {
//                     appObject.name = entity.name;
//                     appObject.shortName = entity.shortName;
//                 }


//                 // grid data update 
//                 search(vm.serverDataList);

//                 // initialze page 
//                 _initApplication();

//                 vm.applicationForm.$setPristine(); // reset form 

//                 showSuccessUpdateMsg(); // show sucessfully updated message 
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         // pagination custom criteria
//         vm.criteria = {
//             page: 1, // no. of page 
//             pagesize: 10, // showing data into one page 

//         };

//         // vm.paginationPageNo = vm.criteria.page;
//         vm.paging = {
//             total: 0,
//             totalpages: 0,
//             fromShowing: 0,
//             toShowing: 0,
//             pagingOptions: [], // page size 
//             tempPaginationOption: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800] // temp page size 
//         };


//         // watch call when any critera property has changed
//         var watchData = vm.$watch('criteria', function (newValue, oldValue) {
//             if (!angular.equals(newValue, oldValue)) {
//                 if (newValue.page <= vm.paging.totalpages) {
//                     search(vm.serverDataList);
//                 } else {
//                     vm.criteria.page = 1;
//                 }
//             }
//         }, true);

//         function search(flatObjectArrayList) {
//             try {


//                 // set order 
//                 flatObjectArrayList = Enumerable.From(flatObjectArrayList).Where(function (x) {
//                     return x;
//                 }).OrderBy("$.name").ToArray();

//                 vm.paging.total = flatObjectArrayList.length;
//                 if (!vm.isPaginationOptionChange)
//                     vm.criteria.pagesize = 10; // set default page size */

//                 vm.paging.totalpages = (Math.ceil(flatObjectArrayList.length / vm.criteria.pagesize)) == 0 ? 1 : (Math.ceil(flatObjectArrayList.length / vm.criteria.pagesize));

//                 // set pagination option 
//                 if (!vm.isPaginationOptionChange) {
//                     vm.paging.pagingOptions.length = 0;
//                     for (var i = 0; i < vm.paging.totalpages; i++) {
//                         if (vm.paging.tempPaginationOption.length > i)
//                             vm.paging.pagingOptions.push(vm.paging.tempPaginationOption[i]);
//                     }
//                     vm.isPaginationOptionChange = true;
//                 }

//                 _getGridViewList(flatObjectArrayList, vm.criteria);

//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         function _getGridViewList(list, entity) {
//             try {
//                 vm.applicationList.length = 0;

//                 // if entity is undefined 
//                 vm.applicationList = getFileterData(list, entity);
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }


//         function getFileterData(list, entity) {
//             try {
//                 var dataList = [];

//                 if (!entity.page || entity.page == 1) {
//                     var pageNo = !entity.page ? 1 : entity.page;

//                     if (list.length >= 10) {
//                         vm.paging.fromShowing = 1;
//                         if (list.length < entity.pagesize) {
//                             vm.paging.toShowing = list.length;
//                         } else {
//                             vm.paging.toShowing = entity.pagesize;
//                         }
//                     } else if (list.length == 0) {

//                         vm.paging.fromShowing = 0;
//                         vm.paging.toShowing = 0;
//                     }
//                     for (var i = 0; i < list.length; i++) {
//                         if (i < pageNo * entity.pagesize) {
//                             dataList.push(list[i]);
//                         }
//                     }
//                     if (list.length < 10 && list.length != 0) {
//                         vm.paging.fromShowing = 1;
//                         vm.paging.toShowing = dataList.length;
//                     }
//                 } else {
//                     if (entity.page <= vm.paging.totalpages) {
//                         var fromPageNo = (entity.page * entity.pagesize) - entity.pagesize + 1;
//                         var tempToPageNo = fromPageNo + entity.pagesize;

//                         for (var k = fromPageNo; k < tempToPageNo; k++) {
//                             if (list[k - 1]) {
//                                 dataList.push(list[k - 1]);
//                             }
//                         }
//                         vm.paging.fromShowing = fromPageNo;
//                         vm.paging.toShowing = fromPageNo + dataList.length - 1;
//                     }
//                 }
//                 return dataList;
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         }

//         // show first page data 
//         vm.pageniToFirst = function () {
//             try {
//                 // if (vm.criteria.page > 1 && !vm.criteria.page)
//                 if (vm.criteria.page > 1)
//                     vm.criteria.page = 1;
//             } catch (e) {
//                 showErrorMsg(e);
//             }

//         };

//         // back to page 
//         vm.pageniBackward = function () {
//             try {
//                 if (vm.criteria.page && vm.criteria.page > 1) {
//                     if (vm.criteria.page <= vm.paging.totalpages)
//                         vm.criteria.page = vm.criteria.page - 1;
//                 }
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         };

//         // forward to page  
//         vm.pageniForward = function () {
//             try {
//                 if (vm.criteria.page < vm.paging.totalpages) {
//                     vm.criteria.page = vm.criteria.page + 1;
//                 }
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         };

//         // show last page data 
//         vm.pageniToLast = function () {
//             try {
//                 if (vm.criteria.page < vm.paging.totalpages) {
//                     vm.criteria.page = vm.paging.totalpages;
//                 }
//             } catch (e) {
//                 showErrorMsg(e);
//             }
//         };

//         // object defination 
//         function application(defaultData) {
//             defaultData = defaultData || {};
//             this._id = defaultData._id || null;
//             this.name = defaultData.name || null;
//             this.shortName = defaultData.shortName || null;
//         }

//     }
// ]);