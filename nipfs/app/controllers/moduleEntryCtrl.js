var app = angular.module('app');

app.controller('moduleEntryCtrl', ['$scope', 'moduleEntryModelSvc', 'moduleEntryDataSvc', '$q', '$timeout', 'commonDataSvc',
    function ($scope, modelSvc, dataSvc, q, $timeout, comnDataSvc) {

        // scope variable
        var vm = $scope;

        // main object 
        vm.module = {};

        // binding varibale 
        vm.applicationList = [];  // appliation list 
        vm.serverDataList = [];  // all module list from server 
        vm.appModuleList = []; // application wise module list 
        vm.moduleList = [];  // list to show into grid view 
        vm.isCancelBtnShow = false;  // cancel button show/ hide 
        vm.isPaginationOptionChange = false; // pagination range option  change  
        vm.tempModule = {};  // temp module 
        vm.appObj = {}; // application drop down selected object 
        vm.isEdit = false; // flag use edit data 

        // binding method 
        vm.getAppInfo = getAppInfo; // applicaton onchange event 
        vm.submitForm = submitForm;
        vm.cancel = cancel;
        vm.reset = reset;
        vm.editModule = editModule;
        vm.deleteModule = deleteModule;

        // constructor 
        _init();

        function _init() {
            try {
                _initModule();

                // get server data 
                _getServerData();

            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // initalize moudule 
        function _initModule() {
            try {
                // new object 
                vm.module = new module();

                vm.tempModule = {};  // temp module 
                vm.appObj = {}; // application drop down selected object 
                vm.isEdit = false; // flag use edit data 
                
            } catch (e) {
                showErrorMsg(e);
            } 
        }
       
        // get server data 
        function _getServerData() {
            try {
              
                var tick = (new Date()).getTime().toString();

                q.all([
                  dataSvc.getModuleData(tick),
                  //dataSvc.getAppData(tick)  // get application data 
                  comnDataSvc.getAppData(tick)  // get application data 
                ]).then(function (data) {
                    $timeout(function () {

                        vm.applicationList = angular.copy(data[1]); // application list 
                        vm.serverDataList = angular.copy(angular.copy(data[0])); // all module data 

                        // prepare grid view 
                        search(vm.serverDataList);
                    }, 0);
                }).catch(function (e) {
                    showErrorMsg(e);
                });

            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // application onchange event 
        function getAppInfo(entity) {
            try {
                vm.isAutoComplete = true;   // autocomplete module list show hide 

                // assaign applicaiton id 
                vm.module = new module({ applicationId: entity._id });

                _showAppModule(entity._id);

                vm.isCancelBtnShow = true;  // cancel button show/ hide 
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // show module application wise 
        function _showAppModule(applicationId) {
            try {
                // filete grid view data application wise 
                vm.appModuleList.length = 0;
                vm.appModuleList = Enumerable.From(vm.serverDataList).Where(function (x) {
                    return x.applicationId == applicationId;
                }).ToArray();

                search(vm.appModuleList);
            } catch (e) {
                showErrorMsg(e);
            } 
        }


        // save module 
        function submitForm() {
            try {
               
                if (!modelSvc.checkDuplicateEntry(vm.serverDataList, vm.module, vm.tempModule)) {
                    if (!vm.module._id) {   // insert module
                        dataSvc.saveOrUpdateEntity(vm.module).then(function (result) {
                            _afterSave(result.data);
                        });
                    } else { // update module 
                        dataSvc.saveOrUpdateEntity(vm.module).then(function (result) {
                            _afterUpdate(result.data);
                        });
                    }
                } else {
                    showDuplicateMsg();
                }
                
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // after update 
        function _afterSave(entity) {
            try {

                // initialize application page 
                _initModule();

                vm.module = new module({applicationId : entity.applicationId});

                // add new entity into list 
                vm.serverDataList.push(entity);

                vm.appModuleList.push(entity);
                // prepare gird view and pagination
                search(vm.appModuleList);

                showSuccessSaveMsg();  // show sucess message 

                // application data show into application dropdown field
                vm.appObj.selected = _getAppInfo(entity);

                vm.moduleEntryForm.$setPristine(); // reset form 
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // after update 
        function _afterUpdate(entity) {
            try {
                
                // updated server data 
                var moduleInfo = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                    return x._id == entity._id;
                });
                if (moduleInfo) {
                    moduleInfo.name = entity.name;
                    moduleInfo.code = entity.code;
                    moduleInfo.applicationId = entity.applicationId;
                }

                // update grid view data 
                var app= Enumerable.From(vm.moduleList).FirstOrDefault(null, function(x) {
                    return x._id == entity.applicationId;
                });

                if (app) {
                    var gridEntity = Enumerable.From(app.moduleList).FirstOrDefault(null, function(x) {
                        return x._id == entity._id;
                    });

                    if (gridEntity) {
                        gridEntity.name = entity.name;
                        gridEntity.code = entity.code;
                        gridEntity.applicationId = entity.applicationId;
                    }
                }
                // if any application is selected 
                var appModuleInfo = Enumerable.From(vm.appModuleList).FirstOrDefault(null, function (x) {
                    return x._id == entity._id;
                });
                if (appModuleInfo) {
                    appModuleInfo.name = entity.name;
                    appModuleInfo.code = entity.code;
                    appModuleInfo.applicationId = entity.applicationId;
                }

                // initialize application page 
                _initModule();

                vm.module = new module({ applicationId: entity.applicationId });

                // application data show into application dropdown field
                vm.appObj.selected = _getAppInfo(entity);

                vm.isEdit = false; // flag use edit data 

                vm.moduleEntryForm.$setPristine(); // reset form 

                showSuccessUpdateMsg();  // show sucessfully updated message 

            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // set applicatio data by application id 
        function _getAppInfo(entity) {
            try {
                var appInfo = Enumerable.From(vm.applicationList).FirstOrDefault(null, function (x) {
                    return x._id == entity.applicationId;
                });

                return appInfo;
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // edit to update data 
        function editModule(entity) {
            try {

                // javascript confirm message 
                if (vm.moduleEntryForm.$dirty) {
                    var result = confirm("Your work is not being saved, do you want to change this without saving?");
                    if (result) {
                        _selectDataForEditing(entity);
                    }
                } else {
                    _selectDataForEditing(entity);
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        function _selectDataForEditing(entity) {
            try {

                vm.isEdit = true;
                vm.isCancelBtnShow = true;
                
                //vm.module = new module();
                vm.module = angular.copy(entity);
                vm.tempModule = angular.copy(entity);

                // application data show into application dropdown field
                vm.appObj.selected = _getAppInfo(entity);

                // show application wise module list 
                _showAppModule(entity.applicationId);
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // delete module 
        function deleteModule(entity) {
            try {
                var result = confirm("Are you sure you want to delete permamently?If yes, press ok.");
                if (result) {
                    dataSvc.deleteModule(entity).then(function (success) {

                        if (success.data.isExist == true) {
                            usagesAnotherScopeMsg();
                        } else {
                            vm.isPaginationOptionChange = false;
                            // return deletedData;
                            if (vm.tempModule._id == entity._id) {
                                _initModule();
                               
                                vm.moduleEntryForm.$setPristine();
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
        
        // UPDATE GRID DATA after delete operation
        function _updateGridData(entity) {
            try {

                // delete from original data list 
                var moduleInfo = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function(x) {
                    return x._id == entity._id; 
                });

                var index = vm.serverDataList.indexOf(moduleInfo);
                if (index > -1)
                    vm.serverDataList.splice(index, 1);

                // delete data from 
                if (vm.module.applicationId) {
                    if (vm.appModuleList.length > 0) {
                        var moduleInfo1 = Enumerable.From(vm.appModuleList).FirstOrDefault(null, function (x) {
                            return x._id == entity._id;
                        });

                        var index1 = vm.appModuleList.indexOf(moduleInfo1);
                        if (index1 > -1)
                            vm.appModuleList.splice(index1, 1);

                        search(vm.appModuleList);
                        return;
                    }
                }
                search(vm.serverDataList);
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // reset action 
        function reset() {
            try {
                if (vm.isEdit) {  // 
                    vm.module = angular.copy(vm.tempModule);
                    vm.moduleEntryForm.$setPristine(); // reset form 

                } else {
                    vm.module = new module();
                    vm.appObj = {};
                    search(vm.serverDataList);
                    vm.moduleEntryForm.$setPristine(); // reset form 
                    vm.appModuleList.length = 0;
                }
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // cancel button 
        function cancel() {
            try {
                _initModule();
                vm.moduleEntryForm.$setPristine(); // reset form 
                vm.appModuleList.length = 0;
                search(vm.serverDataList);  // view all data into grid
                vm.isCancelBtnShow = false;  // cancel button show/ hide 
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        function search(flatObjectArrayList) {
            try {

                // order by reflex index and name 
                flatObjectArrayList = Enumerable.From(flatObjectArrayList).Where(function (x) {
                    return x;
                }).OrderBy("$.applicationId").ThenBy("$.name").ToArray();
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
                // if entity is undefined 
                if (!entity.page) {
                    _preparedata(getFileterData(list, entity));
                } else {
                    _preparedata(getFileterData(list, entity));
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare grid after get all data from server 
        function _preparedata(data) {
            try {
                vm.moduleList.length = 0;
                _prepareGrid(data);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare grid data list 
        function _prepareGrid(data) {
            try {

                for (var i = 0; i < data.length; i++) {
                    var appObj = Enumerable.From(vm.moduleList).FirstOrDefault(null, function(x) {
                        return x._id == data[i].applicationId;
                    });
                    if (!appObj) {  // new application

                        var appInfo = Enumerable.From(vm.applicationList).FirstOrDefault(null, function(x) {
                            return x._id == data[i].applicationId;
                        });

                        var newApp = new application({
                            _id: data[i].applicationId,
                            name: appInfo.name,
                    });
                        newApp.moduleList.push(_getModugeInfo(data[i]));

                        vm.moduleList.push(newApp);
                    } else {
                        appObj.moduleList.push(_getModugeInfo(data[i]));
                    }

                }
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // get module object for grid view 
        function _getModugeInfo(entity) {
            try {
                var modleObj = new module({
                    _id :entity._id,
                    name : entity.name,
                    code:entity.code,
                    applicationId: entity.applicationId
                });

                return modleObj;
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // push data into array 
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

        // pagination custom criteria
        vm.criteria = {
            page: 1,  // no. of page 
            pagesize: 10,   // showing data into one page 

        };

        // vm.paginationPageNo = vm.criteria.page;
        vm.paging = {
            total: 0,
            totalpages: 0,
            fromShowing: 0,
            toShowing: 0,
            pagingOptions: [],  // page size 
            tempPaginationOption: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800]  // temp page size 
        };

        // watch call when any critera property has changed
        var watchData = vm.$watch('criteria', function (newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                if (newValue.page <= vm.paging.totalpages) {
                    if (vm.module.applicationId != null) {
                        search(vm.appModuleList);
                    } else {
                        search(vm.serverDataList);
                    }
                } else {
                    vm.criteria.page = 1;
                }
            }
        }, true);


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


        // object 
        function application(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null;
            this.name = defaultData.name || null;
            this.moduleList = [];  
        }

        function module(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null;
            this.name = defaultData.name || null;
            this.code = defaultData.code || null;
            this.applicationId = defaultData.applicationId || null;
        }

    }]);