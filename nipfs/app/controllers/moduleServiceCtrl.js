var app = angular.module('app');

app.controller('moduleServiceCtrl', ['$scope', 'moduleModelSvc', 'moduleDataSvc', 'commonDataSvc', '$q', '$timeout',
    function ($scope, modelSvc, moduleDataSvc, comnDataSvc,q, $timeout) {


        // scope variable 
        var vm = $scope;
        var moduleEntryList = [];  // module entry list 

        // binding variable 
        vm.isCancelBtnHide = true;
        vm.module = {};
        vm.appObj = {};     // application drop drown data 
        vm.moduleObj = {};  // moudle dropdown data object 
        vm.tempModule = {};
        vm.serverDataList = [];   // all master data list 
        vm.tempPageList = [];
        vm.isPageEdit = false;
        vm.isModuleEdit = false;
        vm.isSectionEdit = false;
        vm.isChecked = false;
        vm.isSectionChecked = false;
        vm.isEmptyData = false;  // for showing data list into page 
        vm.flatObjectArrayList = [];  // all  module and page list 
        vm.moduleMasterList = [];   //  grid view list 
        vm.pageDataList = [];   // page datalist to show page input field 
        vm.sectionDataList = []; // section datalist to show page input field
        vm.applicationList = [];    // application list 
        vm.appModuleList = [];  // application wise server data list 
        vm.appModuleEntryList = [];  // application wise module list 

        // binding method 
        vm.pageCheckChange = pageCheckChange;
        vm.isMainPageChange = isMainPageChange; 
        vm.sectionCheckChange = sectionCheckChange;
        vm.deletePage = deletePage;
        vm.deleteSection = deleteSection;
        vm.submitForm = submitForm;
        vm.reset = reset;
        vm.deleteModuleMasterItem = deleteModuleMasterItem;   // delete module with it's all page list 
        vm.editModuleMasterItem = editModuleMasterItem;
        vm.cancel = cancel;
        //vm.getAppInfo = getAppInfo;

        vm.appOnchange = appOnchange;
        vm.moduleOnchange = moduleOnchange;
        //vm.moduleChange = moduleChange;     // module data change 
        vm.pageOnChange = pageOnChange;     // page data change 
        vm.editPage = editPage;
        vm.editSection = editSection;

        _init();

        function _init() {
            try {
                _initModule();

                // get all module list 
                _getModule();

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // page initialize 
        function _initModule() {
            try {

                vm.module = new module();
                vm.module.pageObj = new page();
                vm.module.pageObj.sectionObj = new section();
                vm.appObj = {};     // application drop drown data 
                vm.moduleObj = {};  // module dropdown data object 
                vm.tempModule = {};
                // manage all edit mode 
                _manageEditMode();
                vm.isChecked = false;
                vm.isSectionChecked = false;
                vm.isCancelBtnHide = true;  // hide cancel button 
                vm.isEmptyData = false;
                vm.pageDataList.length = 0;   // for page datalist to show into section input field 
                vm.sectionDataList.length = 0;   // for section datalist to show into section input field 
                

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // manage all edit mode 
        function _manageEditMode() {
            try {
                vm.isPageEdit = false;
                vm.isModuleEdit = false;
                vm.isSectionEdit = false;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get module list from server 
        function _getModule() {
            try {
                var tick = (new Date()).getTime().toString();

                q.all([
                   moduleDataSvc.getModuleData(tick),
                   comnDataSvc.getAppData(tick),  // get application data 
                   comnDataSvc.getModuleData(tick)  // get module entry data 
                ]).then(function (data) {
                    $timeout(function () {

                        vm.applicationList = angular.copy(data[1]); // application list 
                        moduleEntryList = angular.copy(data[2]);  // module entry list 
                        vm.serverDataList = angular.copy(angular.copy(data[0]));       // all module data 

                        // prepare module by application
                        _prepareModule(vm.serverDataList, false);
                    }, 0);
                }).catch(function (e) {
                    showErrorMsg(e);
                });
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // perpera view by appliation data 
        function _prepareModule(moduleList, isApp) {
            try {
                vm.appModuleList.length = 0;
                vm.appModuleList = angular.copy(moduleList);

                // prepare flatobject list from jason data 
                _prepareFlatObjetArrayList(vm.appModuleList);

                search(vm.flatObjectArrayList);
            } catch (e) {
                showErrorMsg(e);
            }
        }


        function appOnchange(entity) {
            try {
                if (vm.isPageEdit || vm.isSectionEdit)
                    return;

                vm.module.applicationId = entity._id;

                var moduleList = Enumerable.From(vm.serverDataList).Where(function (x) {
                    return x.applicationId == entity._id;
                }).ToArray();

                // prepare module by application 
                _prepareModule(moduleList, true);

                // application onchange effect to module object  and module entry list 
                _appChange(entity);
                vm.isCancelBtnHide = false;  // hide cancel button 

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // 
        function _appChange(entity) {
            try {

                vm.appModuleEntryList.length = 0;

                // application wise module entry list 
                _appModuleEntry(entity._id);

                vm.moduleObj = {};
                vm.module.moduleId = null;
                vm.module._id = null;
                vm.module.moduleCode = null;
                vm.module.fromPageRange = null;
                vm.module.toPageRange = null;
                vm.module.pageObj.pageCode = null;
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // application wise module entry list 
        function _appModuleEntry(applicationId) {
            try {
                vm.appModuleEntryList = Enumerable.From(moduleEntryList).Where(function (x) {
                    return x.applicationId == applicationId;
                }).ToArray();
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // module onchange 
        function moduleOnchange(entity) {
            try {

                if (vm.isPageEdit || vm.isSectionEdit)
                    return;

                var moduleEntryInfo = Enumerable.From(moduleEntryList).FirstOrDefault(null, function(x) {
                    return x._id == entity._id;
                });

                // set page range 
                var moduleInfo = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                    return x.moduleId == entity._id && x.applicationId == vm.module.applicationId;
                });

                if (moduleInfo) { // if module name is exist 
                    vm.isEmptyData = false;  // showing auto complete restriction

                    var list = [];
                    list.push(angular.copy(moduleInfo));

                    // prepare flat list to display into grid 
                    _prepareFlatObjetArrayList(list);

                    search(vm.flatObjectArrayList);


                    vm.module._id = moduleInfo._id;

                    // set moduleId and module code 
                    vm.module.moduleId = entity._id;
                    vm.module.moduleCode = moduleEntryInfo.code;
                    vm.module.fromPageRange = moduleInfo.fromPageRange;
                    vm.module.toPageRange = moduleInfo.toPageRange;
                    // set page code 
                    _setPageCode(moduleInfo._id);

                    vm.isCancelBtnHide = false;  // hide cancel button 

                    vm.tempModule = angular.copy(vm.module);

                    // page data list by module name 
                    vm.pageDataList = angular.copy(moduleInfo.pageList);   // for page datalist 

                } else {

                    vm.isEmptyData = true;
                    vm.pageDataList.length = 0;

                    vm.module = new module({
                        moduleId: entity._id, 
                        moduleCode : moduleEntryInfo.code,
                        applicationId: vm.module.applicationId,
                        appName: vm.module.appName
                    });

                    //_prepareFlatObjetArrayList(vm.serverDataList);
                    var moduleList = Enumerable.From(vm.serverDataList).Where(function (x) {
                        return x.applicationId == vm.module.applicationId;
                    }).ToArray();

                    // prepare module by application 
                    _prepareModule(moduleList, true);

                    search(vm.flatObjectArrayList.length = 0);

                    // reset page info 
                    vm.module.pageObj = new page();

                    //// set module code 
                    _setModuleCode();

                    // set page code 
                    _setPageCode(null);

                }


            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // chage page name 
        function pageOnChange(moduleId, pageName) {
            try {

                // manage section dataList for section input field 
                _displaySectionNameByPageId(vm.module._id, vm.module.pageObj._id);


                if (vm.isPageEdit || vm.isModuleEdit)  // return without any execution if page is on edit mode 
                    return;
                var moduleInfo = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                    return x.moduleId == moduleId;
                });

                if (moduleInfo) {
                    var list = [];   // manage grid view list 

                    var pageInfo = Enumerable.From(moduleInfo.pageList).FirstOrDefault(null, function (x) {
                        return x.pageName == pageName;
                    });

                    if (pageInfo) {   // if page name is exist 

                        list.push(angular.copy(moduleInfo));
                        list[0].pageList.length = 0;
                        list[0].pageList.push(pageInfo);

                        // prepare flat object array for grid view 
                        _prepareFlatObjetArrayList(list);

                        search(vm.flatObjectArrayList);

                        vm.module.pageObj._id = pageInfo._id;
                        vm.module.pageObj.pageCode = pageInfo.pageCode;
                        vm.module.pageObj.description = pageInfo.description;
                        vm.module.pageObj.isMainPage = pageInfo.isMainPage;

                        // manage section dataList for section input field 
                        _displaySectionNameByPageId(vm.module._id, vm.module.pageObj._id);

                    } else {
                        list.push(angular.copy(moduleInfo));

                        // prepare flat object array for grid view 
                        _prepareFlatObjetArrayList(list);

                        search(vm.flatObjectArrayList);

                        // set defalult value when page name is not exist in sever  
                        vm.module.pageObj._id = null;
                        vm.module.pageObj.pageName = vm.module.pageObj.pageName;
                        vm.module.pageObj.description = null;
                        vm.module.pageObj.isMainPage = false;

                        // set page code 
                        _setPageCode(vm.module._id);

                    }
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // edit Page
        function editPage(pageObj, moduleObj) {
            try {

                if (vm.moduleForm.$dirty) {
                    var result = confirm("Your work is not being saved, do you want to change this without saving?");
                    if (result) {
                        _selectPageForEdit(pageObj, moduleObj);
                    }
                }
                else {
                    _selectPageForEdit(pageObj, moduleObj);
                }

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // edit page information from grid view 
        function _selectPageForEdit(pageObj, moduleObj) {
            try {
                vm.isModuleEdit = false;
                vm.isPageEdit = true;
                vm.isSectionEdit = false;
                vm.isChecked = true;

                // assaign object value 
                _initValueObj(null, pageObj, moduleObj);

                // application data show into application dropdown field
                vm.appObj.selected = _getAppInfo(pageObj.applicationId);

                // moduleEntry data show into module dropdown field
                vm.moduleObj.selected = _getModuleInfo(moduleObj.moduleId);
                
                // set module info into temp data 
                vm.tempModule = angular.copy(vm.module);

                // display data by module list into grid view 
                _displaydataByModuleId(pageObj.moduleId, pageObj);

                // cancel button show 
                vm.isCancelBtnHide = false;
                vm.isSectionChecked = false;

                // manage dataList for page input field 
                _managePageDataList(pageObj.moduleId);

                // manage section dataList for section input field 
                _displaySectionNameByPageId(pageObj.moduleId, pageObj._id);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // section edit 
        function editSection(sectionObj, pageObj, moduleObj) {
            try {

                if (vm.moduleForm.$dirty) {
                    var result = confirm("Your work is not being saved, do you want to change this without saving?");
                    if (result) {
                        _selectSectionForEdit(sectionObj, pageObj, moduleObj);
                    }
                }
                else {
                    _selectSectionForEdit(sectionObj, pageObj, moduleObj);
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // section edit from grid view 
        function _selectSectionForEdit(sectionObj, pageObj, moduleObj) {
            try {
                vm.isModuleEdit = false;
                vm.isPageEdit = false;
                vm.isChecked = true;  // check the page checkbox  
                vm.isSectionEdit = true; // check the section checkbox 
                vm.isSectionChecked = true;

                // assagin value into obejct 
                _initValueObj(sectionObj, pageObj, moduleObj);

                // application data show into application dropdown field
                vm.appObj.selected = _getAppInfo(pageObj.applicationId);
                 
                // moduleEntry data show into module dropdown field
                vm.moduleObj.selected = _getModuleInfo(moduleObj.moduleId);

                // set module info into temp data 
                vm.tempModule = angular.copy(vm.module);

                // cancel button show 
                vm.isCancelBtnHide = false;

                // display data by module list into grid view 
                _displaydataByModuleId(pageObj.moduleId, pageObj);

                // manage dataList for page input field 
                _managePageDataList(pageObj.moduleId);

                // manage dataList for section input field 
                _displaySectionNameByPageId(sectionObj.moduleId, sectionObj.pageId);

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // manage dataList for section input field 
        function _displaySectionNameByPageId(moduleId, pageId) {
            try {
                vm.sectionDataList.length = 0;

                var moduleEntity = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                    return x._id == moduleId;
                });

                if (moduleEntity) {
                    var pageEntity = Enumerable.From(moduleEntity.pageList).FirstOrDefault(null, function (x) {
                        return x._id == pageId;
                    });

                    if (pageEntity) {
                        vm.sectionDataList = angular.copy(pageEntity.sectionList);
                    }
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // initialize moudle, page and section object with is vlaue when any item is edited 
        function _initValueObj(sectionObj, pageObj, moduleObj) {
            try {

                vm.module = new module({
                    _id: moduleObj._id,
                    moduleId: moduleObj.moduleId,
                    moduleCode: moduleObj.moduleCode,
                    fromPageRange: moduleObj.fromPageRange,
                    toPageRange: moduleObj.toPageRange,
                    applicationId: moduleObj.applicationId

                });

                vm.module.pageObj = new page({
                    _id: pageObj._id,
                    pageCode: pageObj.pageCode,
                    pageName: pageObj.pageName,
                    description: pageObj.description,
                    isMainPage: pageObj.isMainPage
            });

                if (sectionObj) {
                    vm.module.pageObj.sectionObj = new section({
                        _id: sectionObj._id,
                        sectionName: sectionObj.sectionName,
                        sectionDesc: sectionObj.sectionDesc,
                    });
                } else {
                    // initialize section object 
                    vm.module.pageObj.sectionObj = new section();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // dispaly gird view by module id 
        function _displaydataByModuleId(_id, pageEntity) {  // _id = moduleId
            try {
                var moduleInfo = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                    return x._id == _id;
                });

                if (moduleInfo) { // if module name is exist 

                    var list = [];
                    list.push(angular.copy(moduleInfo));

                    if (pageEntity) {
                        var modulePage = Enumerable.From(list[0].pageList).FirstOrDefault(null, function (x) {
                            return x._id == pageEntity._id;
                        });

                        if (modulePage) {
                            list[0].pageList.length = 0;
                            list[0].pageList.push(modulePage);
                        }
                    }

                    // preprare flate object list 
                    _prepareFlatObjetArrayList(list);

                    if (pageEntity) {
                        var index = _findIndexByKeyValue(vm.flatObjectArrayList, "_id", pageEntity._id);
                        vm.criteria.page = Math.ceil((index + 1) / vm.criteria.pagesize);

                    } else {
                        vm.criteria.page = 1;
                    }

                    // display data into grid view 
                    search(vm.flatObjectArrayList);

                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // set module code
        function _setModuleCode() {
            try {
                if (vm.appModuleList.length == 0) {

                    //vm.module.moduleCode = 1;
                    vm.module.fromPageRange = 100;
                    vm.module.toPageRange = 200;

                } else {

                    // set dynamically module code, fromPageRange and topPageRange 
                    //vm.module.moduleCode = Math.max.apply(Math, vm.appModuleList.map(function (x) { return x.moduleCode; })) + 1;
                    vm.module.fromPageRange = Math.max.apply(Math, vm.appModuleList.map(function (x) { return x.toPageRange; })) + 1;
                    vm.module.toPageRange = Math.max.apply(Math, vm.appModuleList.map(function (x) { return x.toPageRange; })) + 100;

                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // set page code 
        function _setPageCode(moduleId) {
            try {
                var moduleInfo = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                    return x._id == moduleId;
                });

                //vm.module.pageObj = new page();
                //vm.module.pageObj.sectionObj = new section();

                if (moduleInfo) {
                    if (moduleInfo.pageList.length > 0) {
                        if (moduleInfo.pageList[moduleInfo.pageList.length - 1].pageCode < moduleInfo.toPageRange) {
                            vm.module.pageObj.pageCode = vm.isChecked ? moduleInfo.pageList[moduleInfo.pageList.length - 1].pageCode + 1 : null;
                        } else {
                            modulePageUsagesCodeMsg();
                        }
                    } else {
                        vm.module.pageObj.pageCode = vm.isChecked ? moduleInfo.fromPageRange : null;
                    }
                } else {
                    vm.module.pageObj.pageCode = vm.isChecked ? vm.module.fromPageRange : null;
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // set default page section through page check un check 
        function _setPageSection() {
            try {
                vm.isSectionChecked = false;
                vm.module.pageObj.sectionObj = new section();
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // check uncheck page checkbox 
        function pageCheckChange() {
            try {

                if (!vm.module.moduleId)
                    return;

                // initialize page object 
                vm.module.pageObj = new page();

                _setPageCode(vm.module._id);
                _setPageSection();

                // manage dataList for page input field 
                _managePageDataList(vm.module._id);

                /*                // manage section dataList for section input field 
                                _displaySectionNameByPageId(pageObj.moduleId, pageObj._id);*/

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // set page is main or not 
        function isMainPageChange() {
            try {
                if (vm.module.pageObj._id) {
                    // check this page is used an another scope as main page then check cannot be uncheck 
                    moduleDataSvc.checkIsMainPage(vm.module.pageObj).then(function (result) {
                        if (result.data) {
                            vm.module.pageObj.isMainPage = true;
                            usedAsMainPageMsg();
                        }


                    });
                }
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        //section check uncheck operation 
        function sectionCheckChange() {
            try {
                vm.module.pageObj.sectionObj = new section();

                // manage section dataList for section input field 
                _displaySectionNameByPageId(vm.module._id, vm.module.pageObj._id);

            } catch (e) {
                showErrorMsg();
            }
        }

        // delete page from page list 
        function deletePage(entity) {
            try {

                var result = confirm("Are you sure you want to delete permamently?If yes, press ok.");
                if (result) {

                    moduleDataSvc.pageDelete(entity).then(function (success) {

                        if (success.data.isExist == true) {  // if this item is used in another scope 
                            usagesAnotherScopeMsg();
                        } else {
                            var moduleInfo = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                                return x._id == entity.moduleId;
                            });

                            if (moduleInfo) {
                                var pageIndex = _findIndexByKeyValue(moduleInfo.pageList, "_id", entity._id);
                                if (pageIndex > -1) {
                                    moduleInfo.pageList.splice(pageIndex, 1);
                                }
                            }

                            if (vm.module._id) {
                                var list = [];
                                list.push(moduleInfo);

                                // preppare flat object list 
                                _prepareFlatObjetArrayList(list);

                                // show grid view 
                                search(vm.flatObjectArrayList);
                            } else {
                                // preppare flat object list 
                                _prepareFlatObjetArrayList(vm.serverDataList);

                                // show grid view 
                                search(vm.flatObjectArrayList);
                            }

                            if (vm.module.pageObj._id == entity._id) {
                                vm.module.pageObj = new page();

                                vm.isPageEdit = false;
                                // set page code dynamically
                                _setPageCode(entity.moduleId);
                            }

                            // show delete successs message 
                            showSuccessDeletedMsg();
                        }
                    });
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // delete section from grid view 
        function deleteSection(entity) {
            try {
                var result = confirm("Are you sure you want to delete permamently?If yes, press ok.");
                if (result) {
                    moduleDataSvc.sectionDelete(entity).then(function (success) {

                        if (success.data.isExist == true) {  // if this item is used in another scope 
                            usagesAnotherScopeMsg();
                        } else {
                            var moduleInfo = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                                return x._id == entity.moduleId;
                            });
                            if (moduleInfo) {
                                var pageInfo = Enumerable.From(moduleInfo.pageList).FirstOrDefault(null, function (x) {
                                    return x._id == entity.pageId;
                                });
                                if (pageInfo) {
                                    var sectionIndex = _findIndexByKeyValue(pageInfo.sectionList, "_id", entity._id);
                                    if (sectionIndex > -1)
                                        pageInfo.sectionList.splice(sectionIndex, 1);
                                }
                            }

                            // prepare grid data view 
                            if (vm.module._id) {
                                // prepare grid data view after save or update 
                                _prepareSavedDataToView(vm.module, moduleInfo);
                            } else {
                                _prepareFlatObjetArrayList(vm.serverDataList);
                                search(vm.flatObjectArrayList);
                            }

                            // if deleted item is set into object for update then new initialize new object 
                            if (vm.module.pageObj.sectionObj._id == entity._id) {
                                vm.module.pageObj.se = new section();

                                vm.isSectionEdit = false;
                            }

                            // show delete successs message 
                            showSuccessDeletedMsg();
                        }
                    });
                }

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // manage page data list when module is edited 
        function _managePageDataList(moduleId) {
            try {
                var moduleInfo = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                    return x._id == moduleId;
                });
                if (moduleInfo)
                    // page data list by module name for page input field 
                    vm.pageDataList = angular.copy(moduleInfo.pageList);   // for page datalist 
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // reset form 
        function reset() {
            try {
                if (vm.isPageEdit || vm.isModuleEdit || vm.isSectionEdit) {  // for server data 
                    vm.module = angular.copy(vm.tempModule);


                    // manage page data list when module is edited 
                    _managePageDataList(vm.module._id);

                    // manage section dataList for section input field 
                    _displaySectionNameByPageId(vm.module._id, vm.module.pageObj._id);

                } else {  // 
                    _initModule();
                    // set default module code, page range , page code 
                    _setModuleCode();

                    // prepare flate objec array list 
                    _prepareFlatObjetArrayList(vm.serverDataList);

                    // show grid view 
                    search(vm.flatObjectArrayList);

                }
                vm.moduleForm.$setPristine();

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // save or update  data into server 
        function submitForm() {
            try {
                if (!vm.module._id) {  // save data 
                    if (!modelSvc.checkDuplicateEntry(vm.module, vm.tempModule, vm.serverDataList, vm.isModuleEdit)) {
                        moduleDataSvc.saveOrUpdateModuleData(vm.module).then(function (result) {

                            _afterSave(vm.module, result.data);

                            vm.isCancelBtnHide = false;  // show cancel button 

                            // manage all edit mode 
                            _manageEditMode();

                        }, function (ex) {
                            showErrorMsg(ex);
                        });
                    } else {
                        showDuplicateMsg();
                    }
                } else {  // update data 

                    if (!modelSvc.checkDuplicateEntry(vm.module, vm.tempModule, vm.serverDataList, vm.isModuleEdit)
                        && !modelSvc.checkDuplicateChild(vm.module, vm.tempModule, vm.serverDataList, vm.isPageEdit)
                    && !modelSvc.checkDuplicateSection(vm.module, vm.tempModule, vm.serverDataList, vm.isSectionChecked, vm.isSectionEdit)) {
                        moduleDataSvc.saveOrUpdateModuleData(vm.module).then(function (result) {

                            if (vm.isModuleEdit || vm.isPageEdit || vm.isSectionEdit) {
                                showSuccessUpdateMsg();  // show update success message 
                            }

                            // show save message if data has saved 
                            if ((vm.isChecked && !vm.module.pageObj._id) || (vm.isSectionChecked && !vm.module.pageObj.sectionObj._id)) {
                                showSuccessSaveMsg();
                            }

                            // after update operation 
                            _afterUpdate(vm.module, result.data);

                            vm.isCancelBtnHide = false;  // show cancel button 

                            // manage all edit mode 
                            _manageEditMode();

                        }, function (ex) {
                            showErrorMsg(ex);
                        });
                    } else {
                        showDuplicateMsg();
                    }
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // afte update operation 
        function _afterUpdate(clientData, serverData) {
            try {

                var moduleInfo = Enumerable.From(vm.serverDataList).FirstOrDefault(null, function (x) {
                    return x._id == serverData._id;
                });

                if (moduleInfo) {
                    // update module name 
                    moduleInfo.moduleId = serverData.moduleId;
                    moduleInfo.applicationId = serverData.applicationId;

                    if (clientData.pageObj.pageName) {
                        if (clientData.pageObj._id) {  // For update page info 
                            var updatedPagObj = Enumerable.From(moduleInfo.pageList).FirstOrDefault(null, function (x) {
                                return x._id === clientData.pageObj._id;
                            });
                            if (updatedPagObj) {   // update page obj in grid view 
                                updatedPagObj.pageName = clientData.pageObj.pageName;
                                updatedPagObj.description = clientData.pageObj.description;
                                updatedPagObj.isMainPage = clientData.pageObj.isMainPage;

                                // insert or update section here 
                                if (clientData.pageObj.sectionObj.sectionName) {
                                    if (clientData.pageObj.sectionObj._id) { // For update section info 
                                        var updatedSectionObj = Enumerable.From(updatedPagObj.sectionList).FirstOrDefault(null, function (x) {
                                            return x._id === clientData.pageObj.sectionObj._id;
                                        });
                                        if (updatedSectionObj) {
                                            updatedSectionObj.sectionName = clientData.pageObj.sectionObj.sectionName;
                                            updatedSectionObj.sectionDesc = clientData.pageObj.sectionObj.sectionDesc;
                                        }
                                    } else {  // insert new section into new grid view 
                                        var pageObj = Enumerable.From(serverData.pageList).FirstOrDefault(null, function (x) {
                                            return x._id === clientData.pageObj._id;
                                        });
                                        if (pageObj) {
                                            var newSectionObj = Enumerable.From(pageObj.sectionList).FirstOrDefault(null, function (x) {
                                                return x.sectionName === clientData.pageObj.sectionObj.sectionName;
                                            });
                                            if (newSectionObj) {
                                                updatedPagObj.sectionList.push(newSectionObj);
                                            }
                                        }
                                    }
                                }
                            }
                        } else {  // insert new page obj 
                            var newPageObj = Enumerable.From(serverData.pageList).FirstOrDefault(null, function (x) {
                                return x.pageName === clientData.pageObj.pageName;
                            });

                            if (newPageObj) {
                                moduleInfo.pageList.push(newPageObj);
                            }
                        }
                    }
                }

                // prepare grid data view after save or update 
                _prepareSavedDataToView(clientData, moduleInfo);

                // manage update or insert mode 
                _manageUpdaeOrInsertMode(clientData, serverData);

                // page datalist by module name to show into page input field 
                vm.pageDataList = angular.copy(serverData.pageList);   // for page datalist 

                // section dataList by page name to show into section input field 
                _displaySectionNameByPageId(vm.module._id, vm.module.pageObj._id);

                // reset page 
                vm.moduleForm.$setPristine();

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // after save operation 
        function _afterSave(clientData, moduleObj) {
            try {

                // add saved data into main list 
                vm.serverDataList.push(moduleObj);   // push object data into main data list 

                // prepare grid data view after save or update 
                _prepareSavedDataToView(clientData, moduleObj);

                // assaing module object value 
                vm.module._id = moduleObj._id;

                // manage update or insert mode 
                _manageUpdaeOrInsertMode(clientData, moduleObj);

                // value assaign into tempObject 
                vm.tempModule = angular.copy(vm.module);

                // saved success message 
                showSuccessSaveMsg();

                // page datalist by module name to show into page input field 
                vm.pageDataList = angular.copy(moduleObj.pageList);   // for page datalist 

                // section dataList by page name to show into section input field 
                _displaySectionNameByPageId(vm.module._id, vm.module.pageObj._id);

                // reset form 
                vm.moduleForm.$setPristine();

            } catch (e) {
                showErrorMsg(e);
            }

        }

        // prepage save data to grid view 
        function _prepareSavedDataToView(clientData, moduleObj) {
            try {

                // prepare grid view list 
                var list = [];
                list.push(angular.copy(moduleObj));

                // get sepecific page object and it's section list to show grid view 
                var pageInfo = Enumerable.From(moduleObj.pageList).FirstOrDefault(null, function (x) {
                    return x.pageName == clientData.pageObj.pageName;
                });

                // if page is saved show grid data by page 
                if (pageInfo) {
                    list[0].pageList.length = 0;
                    list[0].pageList.push(pageInfo);
                }

                // preppare flat object list 
                _prepareFlatObjetArrayList(list);
                // show grid view 
                search(vm.flatObjectArrayList);
            } catch (e) {
                showErrorMsg();
            }
        }

        // manage update or insert mode 
        function _manageUpdaeOrInsertMode(clientData, moduleObj) {
            try {
                // if section is check then page object cannot be change just section object initialize newly 
                if (vm.isSectionChecked) {
                    var pageEntity = Enumerable.From(moduleObj.pageList).FirstOrDefault(null, function (x) {
                        return x.pageName == clientData.pageObj.pageName;
                    });

                    vm.module.pageObj._id = pageEntity._id;  // assaign page id 
                    vm.module.pageObj.sectionObj = new section();  // initialize new section object 
                } else {
                    vm.module.pageObj = new page();  // initialize new page object 
                    vm.module.pageObj.sectionObj = new section();  // initialize new section object 

                    // set page code dynamically
                    _setPageCode(moduleObj._id);
                }
            } catch (e) {
                showErrorMsg();
            }
        }

        // prepare flate object arrray list 
        function _prepareFlatObjetArrayList(moduleList) {
            try {
                vm.flatObjectArrayList.length = 0;
                vm.isPaginationOptionChange = false;

                for (var i = 0; i < moduleList.length; i++) {
                    if (moduleList[i].pageList.length == 0) {// if no child item into module list
                        vm.flatObjectArrayList.push(_addFlatEntity(moduleList[i], null, null));
                        //vm.flatObjectArrayList.push(_addEmptyNewPageObj(moduleList[i]),null,null);  // add module info 
                    } else { // if child item is exist into module lsit 
                        for (var j = 0; j < moduleList[i].pageList.length; j++) {
                            if (moduleList[i].pageList[j].sectionList.length == 0) {  // if section list is empty 
                                vm.flatObjectArrayList.push(_addFlatEntity(moduleList[i], moduleList[i].pageList[j], null));
                                // vm.flatObjectArrayList.push(_addNewPageObj(moduleList[i], moduleList[i].pageList[j],null));  // add page info 
                            } else {
                                for (var k = 0; k < moduleList[i].pageList[j].sectionList.length; k++) {
                                    vm.flatObjectArrayList.push(_addFlatEntity(moduleList[i], moduleList[i].pageList[j], moduleList[i].pageList[j].sectionList[k]));
                                    // vm.flatObjectArrayList.push(_addNewPageObj(moduleList[i].pageList[j].sectionList[k]));  // add section info 
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // add item into flatObjectArrayList
        function _addFlatEntity(moduleInfo, pageInfo, sectionInfo) {
            try {

                var appInfo = Enumerable.From(vm.applicationList).FirstOrDefault(null, function (x) {
                    return x._id == moduleInfo.applicationId;
                });

                var moduleEntryInfo = Enumerable.From(moduleEntryList).FirstOrDefault(null, function(x) {
                    return x._id == moduleInfo.moduleId; 
                });
                

                var obj = new section({
                    _id: sectionInfo != null ? sectionInfo._id : null,   // section object id 
                    sectionName: sectionInfo != null ? sectionInfo.sectionName : null,
                    sectionDesc: sectionInfo != null ? sectionInfo.sectionDesc : null,   // section description 
                    pageId: pageInfo != null ? pageInfo._id : null,
                    pageName: pageInfo != null ? pageInfo.pageName : null,
                    pageCode: pageInfo != null ? pageInfo.pageCode : null,
                    description: pageInfo != null ? pageInfo.description : null,// page description 
                    isMainPage: pageInfo != null ? pageInfo.isMainPage : null,//  is main page or not 
                    moduleId: moduleInfo._id,
                    moduleName: moduleEntryInfo.name,
                    moduleCode: moduleEntryInfo.code,
                    applicationId: moduleInfo.applicationId,
                    appName: appInfo ? appInfo.name : null,
                });

                obj["fromPageRange"] = moduleInfo.fromPageRange;
                obj["toPageRange"] = moduleInfo.toPageRange;
                obj["moduleEntryId"] = moduleInfo.moduleId;
                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // delete module with it's all page list 
        function deleteModuleMasterItem(entity) {
            try {
                var result = confirm("Are you sure you want to delete?If yes, press ok.");
                if (result) {

                    moduleDataSvc.deleteMasterModule(entity).then(function (success) {

                        if (success.data.isExist == true) {
                            usagesAnotherScopeMsg();
                        } else {

                            var index = _findIndexByKeyValue(vm.serverDataList, "_id", entity._id);
                            vm.serverDataList.splice(index, 1);

                            _prepareFlatObjetArrayList(vm.serverDataList);

                            search(vm.flatObjectArrayList);

                            _initModule();

                            // set default module code, page range and page code 
                            _setModuleCode();

                            // reset form 
                            vm.moduleForm.$setPristine();

                            // show delete success message 
                            showSuccessDeletedMsg();

                        }
                    }, function (ex) {
                        showErrorMsg(ex);
                    }).catch(function (ex) {
                        throw ex;
                    });
                }
            } catch (e) {
                showErrorMsg(e);
            }

        }

        // edite module page list 
        function editModuleMasterItem(entity) {
            try {
                if (vm.moduleForm.$dirty) {
                    var result = confirm("Your work is not being saved, do you want to change this without saving?");
                    if (result) {
                        _selectDataForEdit(entity);
                    }
                }
                else {
                    _selectDataForEdit(entity);
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // select editable entity 
        function _selectDataForEdit(entity) {
            try {

                vm.isModuleEdit = true;
                vm.isPageEdit = false;
                vm.isSectionEdit = false;
                // set master data 

                vm.module = new module({

                    _id: entity._id,
                    moduleId: entity.moduleId,
                    moduleCode: entity.moduleCode,
                    fromPageRange: entity.fromPageRange,
                    toPageRange: entity.toPageRange,
                    applicationId: entity.applicationId
                });

                // application data show into application dropdown field
                vm.appObj.selected = _getAppInfo(entity.applicationId);

                // moduleEntry data show into module dropdown field
                vm.moduleObj.selected = _getModuleInfo(entity.moduleId);

                // show application wise moduleEntry list 
                _appModuleEntry(entity.applicationId);

                // temp module info 
                vm.tempModule = angular.copy(vm.module);

                vm.isChecked = false;
                vm.isSectionChecked = false;

                vm.isCancelBtnHide = false;  // show cancel button 

                // display grid view data by module id 
                _displaydataByModuleId(entity._id, null);

                // manage dataList for page input field 
                _managePageDataList(entity._id);

                // reset form 
                vm.moduleForm.$setPristine();

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get application info 
        function _getAppInfo(applicationId) {
            try {
                var appInfo = Enumerable.From(vm.applicationList).FirstOrDefault(null, function (x) {
                    return x._id == applicationId;
                });

                vm.module.appName = "Of " + appInfo.name;   // assaign application name 

                return appInfo;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get module info 
        function _getModuleInfo(moduleEntryId) {
            try {
                var moduleInfo = Enumerable.From(moduleEntryList).FirstOrDefault(null, function(x) {
                    return x._id == moduleEntryId;
                });


                return moduleInfo;
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // cancel button operation 
        function cancel() {
            try {

                _initModule();
                // set default module code, page range and page code 

                _prepareFlatObjetArrayList(vm.serverDataList);

                search(vm.flatObjectArrayList);
                // set module code 
                _setModuleCode();

                // set page code 
                _setPageCode(null);

                // page data list by module name 
                vm.pageDataList.length = 0;

                // reset form 
                vm.moduleForm.$setPristine();
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // retrun index from object array 
        function _findIndexByKeyValue(arraytosearch, key, valuetosearch) {
            try {
                for (var i = 0; i < arraytosearch.length; i++) {
                    if (arraytosearch[i][key] == valuetosearch) {
                        return i;
                    }
                }
                return -1;
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // ******************************** for pagination 

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
                    search(vm.flatObjectArrayList);
                } else {
                    vm.criteria.page = 1;
                }
            }
        }, true);

        // paging and prepare grid data list 
        function search(flatObjectArrayList) {
            try {

                // set order by moduleName, page name , section
                flatObjectArrayList = Enumerable.From(flatObjectArrayList).Where(function (x) {
                    return x;
                }).OrderBy("$.moduleName").ThenBy("$.pageName").ThenBy("$.sectionName").ToArray();

                vm.paging.total = flatObjectArrayList.length;
                if (!vm.isPaginationOptionChange)
                    vm.criteria.pagesize = 10; // set default page size #3#

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

                // 
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


        // prepare grid after get all data from server 
        function _preparedata(data) {
            try {
                vm.moduleMasterList.length = 0;
                _prepareGrid(data);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare msater child object list  
        function _prepareGrid(data) {
            try {
                for (var i = 0; i < data.length; i++) {
                    var appObj = Enumerable.From(vm.moduleMasterList).FirstOrDefault(null, function (x) {
                        return x._id == data[i].applicationId;
                    });

                    if (!appObj) {   // appliation info 
                        var appObjNew = new application({
                            _id: data[i].applicationId,
                            appName: data[i].appName,
                        });
                        appObjNew.moduleList.push(_getModuleObj(data[i]));
                        vm.moduleMasterList.push(appObjNew);
                    } else {
                        var moduleObj = Enumerable.From(appObj.moduleList).FirstOrDefault(null, function (x) {
                            return x._id == data[i].moduleId;
                        });
                        if (!moduleObj) {
                            appObj.moduleList.push(_getModuleObj(data[i]));
                        } else {
                            var pageObj = Enumerable.From(moduleObj.pageList).FirstOrDefault(null, function (x) {
                                return x._id == data[i].pageId;
                            });
                            if (!pageObj) {  // page list object is not exist into module 
                                // inset page's object and also push section into module obejct if one of them is exist
                                if (data[i].pageId)
                                    moduleObj.pageList.push(_pushPageObj(data[i]));

                            } else {   // page object in exist into module 
                                // jush fieldSpecs push 
                                if (data[i]._id)
                                    pageObj.sectionList.push(_sectionObj(data[i]));
                            }
                        }
                    }
                }

                var a = vm.moduleMasterList;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        //get module info 

        function _getModuleObj(entity) {
            try {

                var obj = new module({
                    _id: entity.moduleId,   // contain master object _id 
                    moduleName: entity.moduleName,  // set module name 
                    moduleCode: entity.moduleCode,
                    applicationId: entity.applicationId,
                    toPageRange: entity.toPageRange,
                    fromPageRange: entity.fromPageRange,
                    moduleId: entity.moduleEntryId,
                   
                });

                if (entity.pageId)
                    obj.pageList.push(_pushPageObj(entity));

                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // page object prepare to push into module object to display grid view  
        function _pushPageObj(entity) {
            try {
                var obj = new page({
                    _id: entity.pageId,
                    pageName: entity.pageName,
                    pageCode: entity.pageCode,
                    description: entity.description,   // page description 
                    isMainPage: entity.isMainPage,   // is main page or not 
                    moduleId: entity.moduleId,
                    moduleName: entity.moduleName,
                    moduleCode: entity.moduleCode,
                    applicationId: entity.applicationId
                });

                obj["fromPageRange"] = entity.fromPageRange;
                obj["toPageRange"] = entity.toPageRange;

                // push section info into page object list 
                if (entity._id)
                    obj.sectionList.push(_sectionObj(entity));

                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // section object prepare to push into page object to display grid view 
        function _sectionObj(entity) {
            try {
                var obj = new section({
                    _id: entity._id,
                    sectionName: entity.sectionName,
                    sectionDesc: entity.sectionDesc,   // section description 
                    pageId: entity.pageId,
                    pageName: entity.pageName,
                    pageCode: entity.pageCode,
                    description: entity.description,  // page description 
                    isMainPage: entity.isMainPage,  // is main page or not 
                    moduleId: entity.moduleId,
                    moduleName: entity.moduleName,
                    moduleCode: entity.moduleCode,
                    applicationId: entity.applicationId
                });

                obj["fromPageRange"] = entity.fromPageRange;
                obj["toPageRange"] = entity.toPageRange;

                return obj;
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

        // declare object     

        function application(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null; // application id 
            this.appName = defaultData.appName || null;
            this.moduleList = [];
        }
        function module(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null;
            this.moduleId = defaultData.moduleId || null;  // module dropdown selected object _id 
            this.moduleName = defaultData.moduleName || null;
            this.moduleCode = defaultData.moduleCode || null;
            this.fromPageRange = defaultData.fromPageRange || null;
            this.toPageRange = defaultData.toPageRange || null;
            this.applicationId = defaultData.applicationId || null;
            this.appName = defaultData.appName || null;
            this.pageList = []; // child list 
            this.pageObj = {};
        }

        function page(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null;
            this.pageName = defaultData.pageName || null;
            this.pageCode = defaultData.pageCode || null;
            this.description = defaultData.description || null;
            this.isMainPage = defaultData.isMainPage || false;
            this.moduleId = defaultData.moduleId || null,  // module master page id 
            this.moduleName = defaultData.moduleName || null;
            this.moduleCode = defaultData.moduleCode || null;
            this.applicationId = defaultData.applicationId || null;
            this.sectionObj = {};   // section object 
            this.sectionList = [];  // child list 
        }

        function section(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null;
            this.sectionName = defaultData.sectionName || null;
            this.sectionDesc = defaultData.sectionDesc || null;   // section description 
            this.pageId = defaultData.pageId || null;
            this.pageName = defaultData.pageName || null;
            this.pageCode = defaultData.pageCode || null;
            this.description = defaultData.description || null; // page description 
            this.isMainPage = defaultData.isMainPage || null; // set flag is main page or not 
            this.moduleId = defaultData.moduleId || null, // module master page id 
            this.moduleName = defaultData.moduleName || null;
            this.moduleCode = defaultData.moduleCode || null;
            this.applicationId = defaultData.applicationId || null;
            this.appName = defaultData.appName || null; // application name 
        }


    }]);
