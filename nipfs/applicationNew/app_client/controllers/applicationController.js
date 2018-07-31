(function () {
    'use strict';

    angular
        .module('app')
        .controller('applicationCtrl', constructor)

    constructor.$inject = ['$scope', 'applicationDataService', 'applicationModelSvc'];

    function constructor($scope, appDataSvc, appModelSvc) {
        /* jshint validthis:true */
        var vm = this;

        // Method binding
        vm.submitForm = submitForm;
        vm.edit = edit;
        vm.deleteApplication = deleteApplication;
        vm.reset = reset;
        vm.cancel = cancel;

        // Variable binding
        vm.application = {}; // Main object for application
        vm.tempApplication = {}; // Application Temp data stor
        vm.serverDataList = []; // Server data list 
        vm.applicatonList = []; // Data for showing grid view
        vm.isCancelBtnShow = false; // cancel button show and hide boolean 
        // Manage grid 
        vm.criteria = {
            page: 1, // no of page
            pagesize: 10, // showing data into one page
        };

        vm.paging = {
            total: 0,
            totalpages: 0,
            formShowing: 0,
            toShowing: 0,
            pagingOptions: [], // page size 
            tempPaginationOption: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800] // temp page size 
        };

        // watch call when any critera property has changed
        var watchData = $scope.$watch('criteria', function (newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                if (newValue.page <= vm.paging.totalpages) {
                    search(vm.serverDataList);
                } else {
                    vm.criteria.page = 1;
                }
            }
        }, true);

        /***************application controller***************/
        // initialize 
        activate();

        function activate(params) {
            try {
                // initialize new application
                _initApplication()
                // get server data
                getServerData();
            } catch (error) {
                showErrorMsg(error);
            }
        }

        // Insert and Update Application data 
        function submitForm(params) {
            try {
                if (!vm.application._id) {
                    // Insert new application
                    if (!appModelSvc.checkDuplicate(vm.application, vm.serverDataList)) {
                        appDataSvc.saveOrUpdateEntity(vm.application).then((result) => {
                            _afterSave(result.data);
                        }).catch((err) => {
                            // show duplicate  message found
                            showDuplicateMsg();
                        });
                    }

                } else {
                    // Update Application
                    if (!appModelSvc.checkDuplicate(vm.application, vm.serverDataList, vm.tempApplication)) {
                        appDataSvc.saveOrUpdateEntity(vm.application).then((result) => {
                            _afterUpdate(result.data);
                        }).catch((err) => {
                            showDuplicateMsg();
                        });
                    }
                }

            } catch (error) {
                showErrorMsg(error);
            }

        }

        // Edit Application
        function edit(entity) {
            try {
                vm.application = angular.copy(entity);
                // Hold data into temp object 
                vm.tempApplication = angular.copy(entity);
                // show cancel button
                vm.isCancelBtnShow = true;
            } catch (error) {
                showErrorMsg(error);
            }
        }

        // Delete Application
        function deleteApplication(entity) {
            try {
                let result = confirm("Are you sure you want to delete permamently? If yes, press ok");
                if (result) {
                    appDataSvc.deleteApp(entity).then((result) => {
                        if (result.data.isExist == true) {
                            usagesAnotherScopeMsg();
                        } else {
                            vm.isPaginationOptionChange = false;
                            // return deletedData
                            if (vm.tempApplication._id == entity._id) {
                                // Application page initialization
                                _initApplication();
                                vm.applicationForm.$setPristine();
                            }
                            _updateGridData(entity);
                            showSuccessDeletedMsg();
                        }
                    }).catch((err) => {
                        showErrorMsg(err)
                    });
                }
            } catch (error) {

            }
        }

        // Reset form 
        function reset() {
            try {
                // assaing old object temp Object property
                vm.application = angular.copy(vm.tempApplication);
                // reset form
                vm.applicationForm.$setPristine();
            } catch (error) {
                showErrorMsg(error);
            }
        }

        //cancel action
        function cancel(params) {
            try {
                // application page initialization
                _initApplication();
            } catch (error) {
                showErrorMsg(error);
            }
        }

        // get server data
        function getServerData(params) {
            try {
                let tick = (new Date()).getTime().toString();
                dataSvc.getApplication(tick).then((result) => {
                    // get flat object array list
                    vm.serverDataList = angular.copy(result);

                    // prepare grid  view and pagination
                    search(vm.serverDataList);
                }).catch((err) => {
                    showErrorMsg(err);
                });
            } catch (error) {
                showErrorMsg(error);
            }
        }

        // search data 
        function search(flatObjectArrayList) {
            try {
                // set order
                flatObjectArrayList = Enumarable.Form(flatObjectArrayList).whare(function (x) {
                    return x;
                }).OrderBy("$.name").ToArray();
                vm.paging.total = flatObjectArrayList.length;
                if (!vm.isPaginationOptionChange)
                    vm.criteria.pagesize = 10; // set default page size 
                vm.paging.totalpages = (Math.ceil(flatObjectArrayList.length / vm.criteria.pagesize)) == 0 ? 1 : (Math.ceil(flatObjectArrayList.length / vm.criteria.pagesize));
                // set pagination option
                if (!vm.isPaginationOptionChange) {
                    vm.paging.pagingOptions.length = 0;
                    for (let i = 0; i < vm.paging.length; i++) {
                        if (vm.paging.tempPaginationOption.length > i) {
                            vm.paging.pagingOptions.push(vm.paging.tempPaginationOption[i]);
                        }
                        vm.isPaginationOptionChange = true;
                    }
                    _getGridViewList(flatObjectArrayList, vm.criteria);
                }

            } catch (error) {
                showErrorMsg(error);
            }
        }

        // get get Fileter Data 
        function getFileterData(list, entity) {
            try {
                let dataList = [];
                if (!entity.page || entity.page == 1) {
                    let pageNo = !entity.page ? 1 : entity.page;

                    if (list.length >= 10) {
                        vm.paging.formShowing = 10;
                        if (list.length < entity.pagesize) {
                            vm.paging.toShowing = list.length;
                        } else {
                            vm.paging.toShowing = entity.pagesize;
                        }
                    } else if (list.length == 0) {
                        vm.paging.formShowing = 0;
                        vm.paging.toShowing = 0;
                    }

                    for (let i = 0; i < list.length; i++) {
                        if (i < pageNo * entity.pagesize) {
                            dataList.push(list[i]);
                        }

                    }
                    if (list.length < 10 && list.length != 0) {
                        vm.paging.formShowing = 1;
                        vm.paging.toShowing = dataList.length;
                    }
                } else {
                    if (entity.page <= vm.paging.totalpages) {
                        let fromPageNo = (entity.page * entity.pagesize) - entity.pagesize + 1;
                        let tempToPageNo = fromPageNo + entity.pagesize;

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
            } catch (error) {
                showErrorMsg(error);
            }
        }








        // initialize application
        function _initApplication() {
            try {
                // initialize new application
                vm.application = new application();
                vm.tempApplication = {};
                vm.isCancelBtnShow = false;
            } catch (error) {
                showErrorMsg(error);
            }

        }
        // Get grit view list 
        function _getGridViewList(list, entity) {
            try {
                vm.applicationList.length = 0;
                vm.applicationList = getFileterData(list, entity);
            } catch (error) {
                showErrorMsg(error);
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
                // Show success message
                showSuccessSaveMsg();
                // reset form
                vm.applicationForm.$setPristine();

            } catch (error) {
                showErrorMsg();
            }
        }

        // After update
        function _afterUpdate(entity) {
            try {
                let appObject = Enumarable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                    return x._id == entity._id;
                });
                if (appObject) {
                    appObject.name = entity.name;
                    appObject.shortName = entity.shortName;
                }

                // Grid data update
                search(vm.serverDataList);
                // initApplication 
                _initApplication();
                // reset form
                vm.applicationForm.$setPristine();
                // show successfully update message
                showSuccessUpdateMsg();
            } catch (error) {
                showErrorMsg();
            }
        }
        // Update grid data after delete entity
        function _updateGridData(entity) {
            try {
                let index = vm.serverDataList.indexOf(entity);
                if (index > -1) {
                    vm.serverDataList.splice(index, 1);
                }
                search(vm.serverDataList);
            } catch (error) {
                showErrorMsg(error);
            }
        }


        // show first page data 
        vm.pageniToFirst = function () {
            try {
                if (vm.criteria.page > 1) {
                    vm.criteria.page = 1;
                }
            } catch (error) {
                showErrorMsg(error);
            }

        };

        // back to page
        vm.pageniBackward = function () {
            try {
                if (vm.criteria.page && vm.criteria.page > 1) {
                    if (vm.criteria.page <= vm.paging.totalpages) {
                        vm.criteria.page = vm.criteria.page - 1;
                    }
                }
            } catch (error) {
                showErrorMsg(error);
            }
        };

        // forward to page  
        vm.pageniForward = function () {
            try {
                if (vm.criteria.page < vm.paging.totalpages) {
                    vm.criteria.page = vm.criteria.page + 1;
                }
            } catch (error) {
                showErrorMsg(error);
            }
        }

        // show last page data 
        vm.pageniToLast = function () {
            try {
                if (vm.criteria.page < vm.paging.totalpages) {
                    vm.criteria.page = vm.paging.totalpages;
                }
            } catch (error) {
                showErrorMsg(error);
            }
        }


        // Object defination
        function application(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null;
            this.name = defaultData.name || null;
            this.showName = defaultData.shortName || null;
        }
    }
})();