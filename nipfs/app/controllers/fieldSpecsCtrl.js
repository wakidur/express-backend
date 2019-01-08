var app = angular.module('app');

app.controller('fieldSpecsCtrl', ['$scope', 'fieldSpecsModelSvc', 'fieldSpecsDataSvc', '$q', '$timeout', '$modal', 'commonDataSvc',
    function ($scope, modelSvc, dataSvc, q, $timeout, $modal, comnDataSvc) {

        var vm = $scope;
        var moduleEntryList = [];

        // binding variable

        vm.confirmationList = [];  // confirmation list with "Yes" and  "No" values 
        vm.inputTypeList = [];
        // vm.tempModuleList = [];  // module list 
        vm.pageList = [];  // page list by module 
        vm.mainPageList = []; // main page list by module 
        vm.sectionList = []; // section list by page 
        vm.moduleList = [];  // get page/ section module  list from server 
        vm.dataTypeList = []; // data type list 
        vm.shortFullTypeList = [];  // short full name type list 
        vm.inputTypeList = [];  // input type list 

        vm.tempFieldList = [];  // all field list from server 
        vm.fieldList = []; // field list 
        vm.modulePageSpecsList = [];   // master list list for showing grid data 
        vm.flatObjectArrayList = [];  // all fieldSpecification list from server 

        vm.appFlatObjList = []; // filter flatObject Array list by application id to show grid view 
        vm.moduleFlatObjList = []; //  filter filatobject arry list by module id to show grid view 
        vm.pageFlatObjList = [];  // fileter flateObjectArryList by page id when page is selected to show grid view 
        vm.mainPageFlatObjList = [];  // // fileter flateObjectArryList by mainPage id when mainPage is selected to show grid view 
        vm.sectionFlatObjList = [];
        vm.applicationList = [];        // application list 
        vm.appModuleList = [];  // application wise module entry list 
        var allFieldList = [];

        // define object 
        vm.fieldSpecs = {};  // main object 
        vm.tempFieldSpecs = {};   // get all object value when data is edited 

        vm.fieldObj = {};
        vm.sectionObj = {};
        vm.pageObj = {};
        vm.mainPageObj = {};  // main page info
        vm.moduleObj = {};
        vm.appObj = {};  // application name dropdown list object 

        // binding method 
        vm.getFieldInfo = getFieldInfo;     // onchange fields
        vm.getAppInfo = getAppInfo; // application onchange 
        vm.getModuleInfo = getModuleInfo;   // onchange module 
        vm.getPageInfo = getPageInfo;   // onchange page 
        vm.getMainPageInfo = getMainPageInfo;  // onchage mainPage
        vm.getSectionInfo = getSectionInfo; // onchange section 
        vm.selectedInputType = selectedInputType;
        vm.selectedshortFullType = selectedshortFullType;

        vm.editFieldSpecs = editFieldSpecs;
        vm.submitForm = submitForm;
        vm.deleteFieldSpecs = deleteFieldSpecs;
        vm.reset = reset;
        vm.cancel = cancel;
        vm.refreshButtonEvent = refreshButtonEvent; // refresh grid data 

        // open modal page 
        vm.openFieldXlsModal = openFieldXlsModal;

        function openFieldXlsModal() {

            // https://jsfiddle.net/zohaib_momin/gutgm683/2/

            // open modal 
            var opts = {
                templateUrl: 'app/views/fieldXls.html',
                controller: 'fieldSpecXlsCtr',
                scope: $scope
            };

            $modal.open(opts);

        };

        //constractor
        init();

        function init() {
            try {
                _pageAllFieldInit(); // all field in  page initialize 
                _getDefaultValues();

                // get data from server 
                _getServerData();

            } catch (e) {
                showErrorMsg(e);  // show error message 
            }
        }

        // all field initialization 
        function _pageAllFieldInit() {
            try {
                vm.isEdit = false;
                vm.fieldSpecs = new fieldSpecs();
                vm.fieldObj = {};
                vm.pageObj = {};
                vm.mainPageObj = {};
                vm.sectionObj = {};
                vm.pageList.length = 0;
                vm.mainPageList.length = 0;
                vm.moduleObj = {};
                vm.appObj = {};
                vm.isCancelBtnHide = true;

                vm.moduleFlatObjList.length = 0;
                vm.pageFlatObjList.length = 0;
                vm.sectionFlatObjList.length = 0;

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get default values 
        function _getDefaultValues() {

            vm.confirmationList = modelSvc.getConfirmationList();
            vm.dataTypeList = modelSvc.getDataTypeList();
            vm.inputTypeList = modelSvc.getInputTypeList();
            vm.shortFullTypeList = modelSvc.getshortFullTypeList();
        }

        // get grid data list 
        function _getServerData() {
            try {
                var tick = (new Date()).getTime().toString();

                q.all([
                    dataSvc.getAllFieldService(tick),
                    dataSvc.getAllModuleService(tick),
                    dataSvc.getAllFieldSpecs(tick),
                    //dataSvc.getAppData(tick)  // get application data 
                    comnDataSvc.getAppData(tick),  // get application data 
                    comnDataSvc.getModuleData(tick)  // get module entry data 
                ]).then(function (data) {
                    $timeout(function () {
                        vm.tempFieldList = angular.copy(data[0]);  // populate all field list from server 

                        // application list 
                        vm.applicationList = angular.copy(data[3]);
                        moduleEntryList = angular.copy(data[4]);  // all module Entry list 
                        vm.moduleList = angular.copy(data[1]);  // populate page section module list

                        allFieldList = angular.copy(data[0]);

                        vm.flatObjectArrayList = angular.copy(_prepareFieldSpecsDataList(data[2]));

                        // sortFlatObjectArrayList(vm.flatObjectArrayList);
                        search(vm.flatObjectArrayList);

                    }, 0);
                }).catch(function (e) {
                    showErrorMsg(e);
                });
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare field specification data list for grid view 
        function _prepareFieldSpecsDataList(dataList) {
            try {
                for (var i = 0; i < dataList.length; i++) {

                    // get module info
                    var moduleInfo = Enumerable.From(vm.moduleList).FirstOrDefault(null, function (x) {
                        return x.moduleId == dataList[i].moduleId;
                    });

                    if (moduleInfo) {

                        // get module entry info 
                        var moduleEntryInfo = _getModuleEntryInfo(dataList[i].moduleId);

                        dataList[i]["moduleName"] = moduleEntryInfo.name;
                        // get application
                        var appInfo = Enumerable.From(vm.applicationList).FirstOrDefault(null, function (x) {
                            return x._id == dataList[i].applicationId;
                        });

                        dataList[i]["appName"] = appInfo.name;

                        // get page info 
                        var pageInfo = Enumerable.From(moduleInfo.pageList).FirstOrDefault(null, function (x) {
                            return x._id == dataList[i].pageId;
                        });
                        if (pageInfo) {
                            dataList[i]["pageName"] = pageInfo.pageName;
                            dataList[i]["pageDesc"] = pageInfo.description;

                            // main page info 
                            var mainPageInfo = Enumerable.From(moduleInfo.pageList).FirstOrDefault(null, function (x) {
                                return x._id == dataList[i].mainPageId;
                            });

                            dataList[i]["mainPageName"] = mainPageInfo.pageName;

                            // get section Info 
                            var sectionInfo = Enumerable.From(pageInfo.sectionList).FirstOrDefault(null, function (x) {
                                return x._id == dataList[i].sectionId;
                            });
                            if (sectionInfo) {
                                dataList[i]["sectionName"] = sectionInfo.sectionName;
                                dataList[i]["sectionDesc"] = sectionInfo.sectionDesc;
                            }
                        }

                    }

                    // get field info 
                    var fieldInfo = Enumerable.From(allFieldList).FirstOrDefault(null, function (x) {
                        return x._id == dataList[i].fieldId;
                    });

                    if (fieldInfo) {
                        dataList[i]["name"] = fieldInfo.name;  // field Name
                        dataList[i]["dataType"] = _getDataType(fieldInfo.dataType);
                        dataList[i]["sh"] = fieldInfo.sh;
                        dataList[i]["fh"] = fieldInfo.fh;

                    }
                    dataList[i]["inputTypeName"] = _getInputType(dataList[i].inputTypeId);
                    dataList[i]["shortFullTypeName"] = _getshorFullNameType(dataList[i].shortFullTypeVal);
                }

                return dataList;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get module entry object 
        function _getModuleEntryInfo(moduleId) {
            try {
                var moduleInfo = Enumerable.From(moduleEntryList).FirstOrDefault(null, function (x) {
                    return x._id == moduleId;
                });

                return moduleInfo;
            } catch (e) {
                showErrorMsg(e);
            }
        }
        // get input type info 
        function _getInputType(id) {
            try {
                var inputTypeObj = Enumerable.From(vm.inputTypeList).FirstOrDefault(null, function (x) {
                    return x.id == id;
                });
                if (inputTypeObj)
                    return inputTypeObj.name;

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get short full name type  type info 
        function _getshorFullNameType(value) {
            try {
                var obj = Enumerable.From(vm.shortFullTypeList).FirstOrDefault(null, function (x) {
                    return x.value == value;
                });
                if (obj)
                    return obj.name;

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get information by field name 
        function getFieldInfo(entity) {
            try {
                if (entity) {
                    _setValuesByField(entity);
                } else {
                    setVluesByFieldEmpty();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // set values by field 
        function _setValuesByField(entity) {
            try {
                vm.fieldSpecs.name = entity.name;  // field name 
                vm.fieldSpecs.fieldId = entity._id;
                vm.fieldSpecs.maxLength = entity.maxLength;
                vm.fieldSpecs.minLength = entity.minLength;
                vm.fieldSpecs.length = entity.length;
                vm.fieldSpecs.fieldDesc = entity.desc;
                vm.fieldSpecs.dataType = _getDataType(entity.dataType);
                vm.fieldSpecs.scale = entity.scale;
                vm.fieldSpecs.sh = entity.sh;
                vm.fieldSpecs.fh = entity.fh;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get dataType 
        function _getDataType(id) {
            try {
                var data = Enumerable.From(vm.dataTypeList).FirstOrDefault(null, function (x) {
                    return x.id == id;
                });
                if (data)
                    return data.name;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // reset fields when field is empty
        function setVluesByFieldEmpty() {
            try {
                vm.fieldSpecs.fieldId = null;
                vm.fieldSpecs.maxLength = null;
                vm.fieldSpecs.minLength = null;
                vm.fieldSpecs.length = null;
                vm.fieldSpecs.fieldDesc = null;
                vm.fieldSpecs.dataType = null;
                vm.fieldSpecs.scale = null;
                vm.fieldSpecs.sh = null;
                vm.fieldSpecs.fh = null;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // user to show gird view by last filder id 
        function filterListDefault() {
            try {
                vm.appFlatObjList.length = 0; // filter flatObject Array list by application id to show grid view 
                vm.moduleFlatObjList.length = 0; //  filter filatobject arry list by module id to show grid view 
                vm.pageFlatObjList.length = 0;  // fileter flateObjectArryList by page id when page have selected to show grid view 
                vm.mainPageFlatObjList.length = 0;  // fileter flateObjectArryList by mainPage id when mainPage have selected to show grid view 
                vm.sectionFlatObjList.length = 0;   // filter flatObjectArrayList by section to show grid view 

            } catch (e) {
                showErrorMsg();
            }
        }

        // application data onchange
        function getAppInfo(entity) {
            try {

                vm.fieldSpecs.appName = entity.name;
                vm.fieldSpecs.applicationId = entity._id;

                // defalut module info 
                vm.moduleObj = {};
                vm.fieldSpecs.moduleId = null;

                // get module list 
                _getAppModuleList(entity._id);

                // default page info 
                _defaultPageInfo();


                // application wise field list 
                vm.fieldList = Enumerable.From(allFieldList).Where(function (x) {
                    return x.applicationId == entity._id;
                }).ToArray();

                vm.isCancelBtnHide = false;  // hide cancel button 

                // application wise filter grid data list 
                _getFileSpecListByApplication(entity._id);

            } catch (e) {
                showErrorMsg(e);
            }
        }


        function _getFileSpecListByApplication(appId) {
            try {
                // set all fiterlist length zero 
                filterListDefault();

                // get filed application wise 
                vm.appFlatObjList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.applicationId == appId;
                }).ToArray();

                search(vm.appFlatObjList);

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get application wise module list 
        function _getAppModuleList(applicationId) {
            try {
                var appModuleList = Enumerable.From(moduleEntryList).Where(function (x) {
                    return x.applicationId == applicationId;
                }).ToArray();
                // assaign module list 
                vm.appModuleList = angular.copy(appModuleList);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get module info with page list 
        function getModuleInfo(entity) {
            try {
                _defaultPageInfo();

                var modulePage = Enumerable.From(vm.moduleList).FirstOrDefault(null, function (x) {
                    return x.moduleId == entity._id;
                });

                if (modulePage) {
                    vm.pageList = angular.copy(modulePage.pageList);
                    vm.mainPageList = _getMainPage();
                }

                vm.fieldSpecs.moduleId = entity._id;
                vm.fieldSpecs.moduleName = entity.name;
                vm.isCancelBtnHide = false;

                // filter field specification list by page id 
                _getFileSpecListByModyule(entity._id);

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get main page module wise 
        function _getMainPage() {
            try {
                var mainPageList = Enumerable.From(vm.pageList).Where(function (x) {
                    return x.isMainPage;
                }).ToArray();

                return mainPageList;
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // defalut page info 
        function _defaultPageInfo() {
            try {
                vm.pageObj = {};
                vm.mainPageObj = {};
                vm.sectionObj = {};

                vm.pageList.length = 0;
                vm.mainPageList.length = 0;
                // page 
                vm.fieldSpecs.pageId = null;
                vm.fieldSpecs.pageName = null;
                vm.fieldSpecs.pageDesc = null;
                // main page 
                vm.fieldSpecs.mainPageId = null;
                vm.fieldSpecs.mainPageName = null;

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get page info 
        function getPageInfo(entity) {
            try {

                vm.sectionObj = {};

                vm.sectionList.length = 0;
                vm.fieldSpecs.sectionId = null;
                vm.fieldSpecs.sectionName = null;
                vm.fieldSpecs.sectionDesc = null;

                vm.fieldSpecs.pageId = entity._id;
                vm.fieldSpecs.pageName = entity.pageName;
                vm.fieldSpecs.pageDesc = entity.description;

                // section list by page
                vm.sectionList = angular.copy(entity.sectionList);

                // filter field specification list by page id 
                _showFieldSpcListByPage(entity._id);

            } catch (e) {
                showErrorMsg(e);
            }
        }


        // get main page info from dropdown list 
        function getMainPageInfo(entity) {
            try {
                vm.fieldSpecs.mainPageId = entity._id;
                vm.fieldSpecs.mainPageName = entity.pageName;

                // filter field specification list by main pageId
                _showFieldSpcListByMainPage(entity._id);



            } catch (e) {
                showErrorMsg(e);
            }
        }


        // get section info 
        function getSectionInfo(entity) {
            try {

                vm.fieldSpecs.sectionId = entity._id;
                vm.fieldSpecs.sectionName = entity.sectionName;
                vm.fieldSpecs.sectionDesc = entity.sectionDesc;

                // filter grid view by section Name 
                _showFieldSpecListBySection(entity._id, null);

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // filter field specification list by module
        function _getFileSpecListByModyule(moduleId) {
            try {
                // set all fiterlist length zero 
                filterListDefault();

                vm.moduleFlatObjList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.moduleId == moduleId;
                }).ToArray();

                // prepare grid view list 
                search(vm.moduleFlatObjList);

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // fileter field specification list by page id 
        function _showFieldSpcListByPage(pageId, entity) {
            try {

                // set all fiterlist length zero 
                filterListDefault();

                vm.pageFlatObjList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.pageId == pageId;
                }).ToArray();

                // prepare grid view list 
                search(vm.pageFlatObjList);

            } catch (e) {
                showErrorMsg();
            }
        }


        // filter field specification list by main page id 
        function _showFieldSpcListByMainPage(pageId) {
            try {
                // set all fiterlist length zero 
                filterListDefault();

                vm.mainPageFlatObjList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.mainPageId === pageId;
                }).ToArray();

                // prepare grid view list 
                search(vm.mainPageFlatObjList);

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // filter field specification list by section 
        function _showFieldSpecListBySection(sectionId, entity) {
            try {
                // set all fiterlist length zero 

                if (vm.isEdit)
                    return;

                filterListDefault();
                if (sectionId) {
                    vm.sectionFlatObjList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                        return x.sectionId == sectionId;
                    }).OrderBy("$.appName").ThenBy("$.moduleName").ThenBy("$.mainPageName").ThenBy("$.pageName").ThenBy("$.sectionName").ThenBy("$.name").ToArray();

                    if (entity) {
                        var index = _findIndexByKeyValue(vm.sectionFlatObjList, "_id", entity._id);
                        vm.criteria.page = Math.ceil((index + 1) / vm.criteria.pagesize);
                    } else {
                        vm.criteria.page = 1;  // set page no. when new data is loaded */
                    }

                    // prepare grid view list 
                    search(vm.sectionFlatObjList);
                } else {
                    vm.pageFlatObjList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                        return x.pageId == vm.fieldSpecs.pageId;
                    }).OrderBy("$.appName").ThenBy("$.moduleName").ThenBy("$.mainPageName").ThenBy("$.pageName").ThenBy("$.sectionName").ThenBy("$.name").ToArray();

                    if (entity) {
                        var index1 = _findIndexByKeyValue(vm.pageFlatObjList, "_id", entity._id);
                        vm.criteria.page = Math.ceil((index1 + 1) / vm.criteria.pagesize);
                    } else {
                        vm.criteria.page = 1;  // set page no. when new data is loaded */
                    }

                    // prepare grid view list 
                    search(vm.pageFlatObjList);
                }

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get input type name 
        function selectedInputType(id) {
            try {
                var inputTypeInfo = Enumerable.From(vm.inputTypeList).FirstOrDefault(null, function (x) {
                    return x.id == id;
                });
                if (inputTypeInfo)
                    vm.fieldSpecs.inputTypeName = inputTypeInfo.name;

                if (id == 1) {
                    vm.fieldSpecs.isMandatory = null;
                }

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get short full type name info 

        function selectedshortFullType(value) {
            try {
                var shortFullTypeInfo = Enumerable.From(vm.shortFullTypeList).FirstOrDefault(null, function (x) {
                    return x.value == value;
                });
                if (shortFullTypeInfo)
                    vm.fieldSpecs.shortFullTypeName = shortFullTypeInfo.name;

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // save and update data into database 
        function submitForm() {
            try {
                if (!vm.fieldSpecs._id) {  // for insert 

                    // check duplicate data 
                    if (!modelSvc.checkDuplicateEntry(vm.fieldSpecs, vm.flatObjectArrayList)) {
                        dataSvc.saveOrUpdateFieldService(vm.fieldSpecs).then(function (result) {
                            _afterSave(result.data, vm.fieldSpecs);
                        });
                    } else {
                        showDuplicateMsg();
                    }
                } else {  // for update 
                    if (!modelSvc.checkUpdateDuplicateEntry(vm.fieldSpecs, vm.tempFieldSpecs, vm.flatObjectArrayList)) {
                        dataSvc.saveOrUpdateFieldService(vm.fieldSpecs).then(function (result) {
                            //  var updatedData = result.fieldSpecs;
                            _afterUpdate(result.fieldSpecs, vm.fieldSpecs);
                        });
                    } else {
                        showDuplicateMsg();
                    }

                }
                // check validation "cannot entry same module and page "
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // after save 
        function _afterSave(data, clientObj) {
            try {

                _addToFlatObjectArrayList(data, clientObj);  // add save data into flat object array list 
                _setDefalutValue();
                vm.fieldSpecsForm.$setPristine();
                showSuccessSaveMsg();
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // update update grid and pagination update 
        function _afterUpdate(data, clientObj) {
            try {

                vm.isEdit = false;

                _updateFlatObjectArrayList(data, clientObj);
                _setDefalutValue();
                vm.fieldSpecsForm.$setPristine();
                showSuccessUpdateMsg();
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // set default value 
        function _setDefalutValue() {
            try {

                vm.fieldObj = {};  // default field combobx  

                vm.fieldSpecs._id = null;
                vm.fieldSpecs.fieldId = null;
                vm.fieldSpecs.name = null; // field name 
                vm.fieldSpecs.sh = null;  // short header
                vm.fieldSpecs.fh = null;  // full header
                vm.fieldSpecs.fieldDesc = null;
                vm.fieldSpecs.dataType = null;
                vm.fieldSpecs.maxLength = null;
                vm.fieldSpecs.minLength = null;
                vm.fieldSpecs.scale = null;
                vm.fieldSpecs.length = null;
                vm.fieldSpecs.isMandatory = false;
                vm.fieldSpecs.permValues = null;
                vm.fieldSpecs.isEditable = false;
                vm.fieldSpecs.inputTypeId = null;
                vm.fieldSpecs.inputTypeName = null;
                vm.fieldSpecs.shortFullTypeVal = null;
                vm.fieldSpecs.shortFullTypeName = null;

            } catch (e) {
                showErrorMsg(e);
            }
        }
        // update flat object list 
        function _updateFlatObjectArrayList(data, clientObj) {
            try {
                var finalEntity = _prepareFinalEntity(data, clientObj);
                var index = _findIndexByKeyValue(vm.flatObjectArrayList, "_id", data._id);
                if (index > -1)
                    angular.extend(vm.flatObjectArrayList[index], finalEntity);

                sortFlatObjectArrayList(vm.flatObjectArrayList);

                // _showFieldSpcListByPage(data.pageId, null);
                _showFieldSpecListBySection(data.sectionId, null);    // show grid view by section 

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

        // add to flate object arrary list 
        function _addToFlatObjectArrayList(entity, clientObj) {
            try {

                vm.isPaginationOptionChange = false; // set pagination 

                var finalEntity = _prepareFinalEntity(entity, clientObj);

                // add data into main flat list 
                vm.flatObjectArrayList.push(finalEntity);

                // sorting flatobjectArray list by module name 
                sortFlatObjectArrayList(vm.flatObjectArrayList);

                // show grid view and set pagination
                _showFieldSpecListBySection(entity.sectionId, null);
                //_showFieldSpcListByPage(entity.pageId, null);
                //search(vm.flatObjectArrayList);

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // sorting flate object list 
        function sortFlatObjectArrayList(dataList) {
            try {
                var mainList = Enumerable.From(dataList).Where(function (x) {
                    return x;
                }).OrderBy("$.appName").ThenBy("$.moduleName").ToArray();
                vm.flatObjectArrayList = angular.copy(mainList);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare final entity to show into grid 
        function _prepareFinalEntity(entity, clientObj) {
            try {
                entity["appName"] = clientObj.appName;
                entity["moduleName"] = clientObj.moduleName;
                entity["pageName"] = clientObj.pageName;
                entity["mainPageName"] = clientObj.mainPageName;
                entity["sectionName"] = clientObj.sectionName;
                entity["name"] = clientObj.name; // field name 
                entity["fieldDesc"] = clientObj.fieldDesc;
                entity["dataType"] = clientObj.dataType;
                entity["maxLength"] = clientObj.maxLength;
                entity["minLength"] = clientObj.minLength;
                entity["length"] = clientObj.length;
                entity["scale"] = clientObj.scale;
                entity["sh"] = clientObj.sh;
                entity["fh"] = clientObj.fh;
                entity["inputTypeName"] = clientObj.inputTypeName;
                entity["shortFullTypeName"] = clientObj.shortFullTypeName;

                return entity;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // reset method 
        function reset() {
            try {
                if (vm.fieldSpecs._id) {

                    vm.fieldSpecs = new fieldSpecs();
                    angular.extend(vm.fieldSpecs, vm.tempFieldSpecs);

                    vm.moduleObj.selected = _getModuleInfo(vm.fieldSpecs.moduleId);
                    vm.pageObj.selected = _getPageInfo(vm.fieldSpecs.pageId);
                    vm.mainPageObj.selected = _getMainPageInfo(vm.fieldSpecs.mainPageId);
                    vm.sectionObj.selected = _getSectionInfo(vm.fieldSpecs.sectionId);
                    vm.fieldObj.selected = _getFieldServiceInfo(vm.fieldSpecs.fieldId);

                    // reset grid data list with paging 
                    if (vm.fieldSpecs.sectionId) {
                        search(vm.sectionFlatObjList);
                    } else {
                        search(vm.pageFlatObjList);
                    }
                    //search(vm.sectionFlatObjList);
                    //search(vm.pageFlatObjList);

                    vm.fieldSpecsForm.$setPristine();
                } else {
                    _pageAllFieldInit();

                    // reset grid data list with paging 
                    search(vm.flatObjectArrayList);

                    vm.fieldSpecsForm.$setPristine();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // edit field data 
        function editFieldSpecs(entity) {
            try {
                // javascript confirm message 
                if (vm.fieldSpecsForm.$dirty) {
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

        // select data for editting 
        function _selectDataForEditing(entity) {
            try {

                vm.fieldSpecs = new fieldSpecs();    // original field object 
                vm.tempFieldSpecs = new fieldSpecs();  // temp field object 

                // set all object property for update 
                angular.extend(vm.fieldSpecs, entity);

                // get module list 
                _getAppModuleList(entity.applicationId);

                // application data show into application dropdown field
                vm.appObj.selected = _getAppInfo(vm.fieldSpecs.applicationId);
                vm.moduleObj.selected = _getModuleInfo(vm.fieldSpecs.moduleId);
                vm.pageObj.selected = _getPageInfo(vm.fieldSpecs.pageId);
                vm.mainPageObj.selected = _getMainPageInfo(vm.fieldSpecs.mainPageId);
                vm.sectionObj.selected = _getSectionInfo(vm.fieldSpecs.sectionId);
                vm.fieldObj.selected = _getFieldServiceInfo(vm.fieldSpecs.fieldId);

                // set data into temp object 
                angular.extend(vm.tempFieldSpecs, vm.fieldSpecs);

                vm.isCancelBtnHide = false;  // show cancel button 

                // get filed list by application wise
                vm.fieldList.length.length = 0;
                vm.fieldList = Enumerable.From(allFieldList).Where(function (x) {
                    return x.applicationId == entity.applicationId;
                }).OrderBy("$.name").ToArray();

                vm.fieldSpecsForm.$setPristine();  // reset form 

                //  filter grid data by page id 
                _showFieldSpecListBySection(entity.sectionId, entity);

                vm.isEdit = true;

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
                return appInfo;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get module info 
        function _getModuleInfo(moduleId) {
            try {

                var moduleInfo = Enumerable.From(moduleEntryList).FirstOrDefault(null, function (x) {
                    return x._id == moduleId;
                });
                if (moduleInfo) {
                    var pageModule = Enumerable.From(vm.moduleList).FirstOrDefault(null, function (x) {
                        return x.moduleId == moduleId;
                    });

                    vm.pageList = angular.copy(pageModule.pageList);

                    // main page 
                    vm.mainPageList = _getMainPage();
                }
                return moduleInfo;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get page information 
        function _getPageInfo(pageId) {
            try {
                var pageInfo = Enumerable.From(vm.pageList).FirstOrDefault(null, function (x) {
                    return x._id == pageId;
                });
                if (pageInfo) {
                    vm.fieldSpecs.pageDesc = pageInfo.description;

                    // section list into section dropdown field 
                    vm.sectionList = pageInfo.sectionList;
                }
                return pageInfo;
            } catch (e) {
                showErrorMsg.length(e);
            }
        }

        // get main page information
        function _getMainPageInfo(mainPageId) {
            try {
                var mainPageInfo = Enumerable.From(vm.mainPageList).FirstOrDefault(null, function (x) {
                    return x._id === mainPageId;
                });
                return mainPageInfo;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get section information 
        function _getSectionInfo(sectionId) {
            try {
                var sectionInfo = Enumerable.From(vm.sectionList).FirstOrDefault(null, function (x) {
                    return x._id == sectionId;
                });
                if (sectionInfo)
                    return sectionInfo;

                return null;
            } catch (e) {
                showErrorMsg(e);
            }
        }
        // get field information 
        function _getFieldServiceInfo(fieldId) {
            try {
                var moduleInfo = Enumerable.From(allFieldList).FirstOrDefault(null, function (x) {
                    return x._id == fieldId;
                });

                return moduleInfo;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // delete field specefication
        function deleteFieldSpecs(entity) {
            try {
                var result = confirm("Are you sure you want to delete permamently?If yes, press ok.");
                if (result) {
                    dataSvc.deleteFieldSpecs(entity).then(function () {
                        vm.isPaginationOptionChange = false;
                        // return deletedData;
                        if (vm.tempFieldSpecs._id == entity._id) {
                            _pageAllFieldInit();
                            vm.fieldSpecsForm.$setPristine();
                        }
                        _updateGridData(entity);

                        showSuccessDeletedMsg();

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
                var index = _findIndexByKeyValue(vm.flatObjectArrayList, "_id", entity._id);
                if (index > -1)
                    vm.flatObjectArrayList.splice(index, 1);

                if (vm.fieldSpecs.sectionId) {
                    _showFieldSpecListBySection(entity.sectionId);
                    //_showFieldSpcListByPage(entity.pageId);
                } else {
                    search(vm.flatObjectArrayList);
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }


        function cancel() {
            try {
                _pageAllFieldInit(); // all field in  page initialize 
                vm.fieldSpecsForm.$setPristine();  // form pristine 

                search(vm.flatObjectArrayList);

            } catch (e) {
                showErrorMsg(e);
            }
        }


        // refresh grid data 
        function refreshButtonEvent() {
            try {

                var tick = (new Date()).getTime().toString();
                dataSvc.getAllFieldSpecs(tick).then(function (data) {
                    vm.flatObjectArrayList = angular.copy(_prepareFieldSpecsDataList(data));

                    vm.isPaginationOptionChange = false;
                    vm.criteria.page = 1;
                    if (vm.fieldSpecs.sectionId) {  // filter section wise 
                        _showFieldSpecListBySection(vm.fieldSpecs.sectionId, null);
                        return;
                    }

                    else if (vm.fieldSpecs.pageId) { // filter page wise 
                        _showFieldSpcListByPage(vm.fieldSpecs.pageId);
                        return;
                    }

                    else if (vm.fieldSpecs.mainPageId) { // filter main page wise 
                        _showFieldSpcListByMainPage(vm.fieldSpecs.mainPageId);
                        return;
                    }

                    else if (vm.fieldSpecs.moduleId) { // filter module wise 
                        _getFileSpecListByModyule(vm.fieldSpecs.moduleId);
                        return;
                    }
                    else if (vm.fieldSpecs.applicationId) { // filter application wise 
                        _getFileSpecListByApplication(vm.fieldSpecs.applicationId);
                        return;
                    } else
                        search(vm.flatObjectArrayList);

                });

            } catch (e) {
                showErrorMsg(e);
            }
        }



        // ************************************** 
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
                    if (vm.sectionFlatObjList.length != 0) {
                        search(vm.sectionFlatObjList);
                    } else if (vm.pageFlatObjList.length != 0) {
                        search(vm.pageFlatObjList);
                    } else if (vm.moduleFlatObjList.length != 0) {
                        search(vm.moduleFlatObjList);
                    } else if (vm.appFlatObjList.length != 0) {
                        search(vm.appFlatObjList);
                    } else {
                        search(vm.flatObjectArrayList);
                    }

                    /* if (vm.sectionFlatObjList.length != 0) {
                        search(vm.sectionFlatObjList);
                    } else {
                        search(vm.flatObjectArrayList);
                    }*/
                } else {
                    vm.criteria.page = 1;
                }
            }
        }, true);

        function search(flatObjectArrayList) {
            try {

                // set order by moduleName, page name , section
                flatObjectArrayList = Enumerable.From(flatObjectArrayList).Where(function (x) {
                    return x;
                }).OrderBy("$.appName").ThenBy("$.moduleName").ThenBy("$.mainPageName").ThenBy("$.pageName").ThenBy("$.sectionName").ThenBy("$.name").ToArray();

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
                vm.modulePageSpecsList.length = 0;
                _prepareGrid(data);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare grid data list  
        function _prepareGrid(data) {
            try {
                for (var i = 0; i < data.length; i++) {

                    var appObj = Enumerable.From(vm.modulePageSpecsList).FirstOrDefault(null, function (x) {
                        return x.applicationId == data[i].applicationId;
                    });
                    if (!appObj) {    // app is not exist 
                        var appObjNew = new application({
                            applicationId: data[i].applicationId,
                            appName: data[i].appName
                        });

                        appObjNew.moduleList.push(_getModuleObj(data[i]));
                        vm.modulePageSpecsList.push(appObjNew);

                    } else {
                        var moduleObj = Enumerable.From(appObj.moduleList).FirstOrDefault(null, function (x) {
                            return x.moduleId == data[i].moduleId;
                        });
                        if (!moduleObj) { // module is not exist 
                            appObj.moduleList.push(_getModuleObj(data[i]));
                        } else {
                            var mainPageObj = Enumerable.From(moduleObj.mainPageList).FirstOrDefault(null, function (x) {
                                return x.mainPageId == data[i].mainPageId;
                            });
                            if (!mainPageObj) {   // main page is not exist 
                                moduleObj.mainPageList.push(_getMainPageObj(data[i]));
                            } else {
                                var pageObj = Enumerable.From(mainPageObj.pageList).FirstOrDefault(null, function (x) {
                                    return x.pageId == data[i].pageId;
                                });
                                if (!pageObj) { // page is not exist 
                                    mainPageObj.pageList.push(_getPageObj(data[i]));
                                } else {
                                    var sectionObj = Enumerable.From(pageObj.sectionList).FirstOrDefault(null, function (x) {
                                        return x.sectionId == data[i].sectionId;
                                    });
                                    if (!sectionObj) { // insert new section into section list of page object 
                                        pageObj.sectionList.push(_getSectionObj(data[i]));
                                    } else {
                                        sectionObj.fieldSpecsList.push(_fieldSpecsObj(data[i]));  // insert field object into section 
                                    }
                                }
                            }
                        }

                    }
                }

                // *************************************************
                var test = vm.modulePageSpecsList;

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get module object 
        function _getModuleObj(entity) {
            try {
                var obj = new module({
                    moduleId: entity.moduleId,
                    moduleName: entity.moduleName  // set module name 
                });

                obj.mainPageList.push(_getMainPageObj(entity));
                //obj.pageList.push(_getPageObj(entity));

                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get main page object to push into modle 
        function _getMainPageObj(entity) {
            try {
                var obj = new mainPage({
                    mainPageId: entity.mainPageId,
                    mainPageName: entity.mainPageName
                });

                // push page object into main page 
                obj.pageList.push(_getPageObj(entity));

                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get page object to push into module 
        function _getPageObj(entity) {
            try {
                var obj = new page({
                    pageId: entity.pageId,
                    pageName: entity.pageName,
                });

                // push section Object into page 
                obj.sectionList.push(_getSectionObj(entity));

                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get section object to push into page 
        function _getSectionObj(entity) {
            try {
                var obj = new section({
                    sectionId: entity.sectionId,
                    sectionName: entity.sectionName,
                });

                // push field object into section 
                obj.fieldSpecsList.push(_fieldSpecsObj(entity));

                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // prepare field object to show into grid view 
        function _fieldSpecsObj(entity) {
            try {
                var obj = new fieldSpecs({
                    _id: entity._id,
                    moduleId: entity.moduleId,
                    moduleName: entity.moduleName,
                    desc: entity.desc,
                    mainPageId: entity.mainPageId,
                    mainPageName: entity.mainPageName,
                    pageId: entity.pageId,
                    pageName: entity.pageName,
                    sectionId: entity.sectionId,
                    sectionName: entity.sectionName,
                    sectionDesc: entity.sectionDesc,
                    fieldId: entity.fieldId,
                    name: entity.name,  // field Name 
                    fieldDesc: entity.fieldDesc,
                    dataType: entity.dataType,
                    maxLength: entity.maxLength,
                    minLength: entity.minLength,
                    scale: entity.scale,
                    sh: entity.sh,
                    fh: entity.fh,
                    length: entity.length,
                    //isMandatory: entity.isMandatory,
                    permValues: entity.permValues,
                    isEditable: entity.isEditable,
                    inputTypeId: entity.inputTypeId,
                    inputTypeName: entity.inputTypeName,
                    shortFullTypeVal: entity.shortFullTypeVal,
                    shortFullTypeName: entity.shortFullTypeName,
                    applicationId: entity.applicationId,
                    appName: entity.appName,

                });

                obj.isMandatory = entity.isMandatory == null ? null : entity.isMandatory;

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

        // declare  model object   

        function application(defaultData) {
            defaultData = defaultData || {};
            this.appName = defaultData.appName || null;
            this.applicationId = defaultData.applicationId || null;
            this.moduleList = [];
        }
        function module(defaultData) {
            defaultData = defaultData || {};
            this.moduleId = defaultData.moduleId || null;
            this.moduleName = defaultData.moduleName || null;
            this.mainPageList = [];
        }

        function mainPage(defaultData) {
            defaultData = defaultData || {};
            this.mainPageId = defaultData.mainPageId || null;
            this.mainPageName = defaultData.mainPageName || null;
            this.pageList = [];
        }
        function page(defaultData) {
            defaultData = defaultData || {};
            this.pageId = defaultData.pageId || null;
            this.pageName = defaultData.pageName || null;
            this.sectionList = [];
        }

        function section(defaultData) {
            defaultData = defaultData || {};
            this.sectionId = defaultData.sectionId || null;
            this.sectionName = defaultData.sectionName || null;
            this.fieldSpecsList = [];
        }
        function fieldSpecs(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null;
            this.moduleId = defaultData.moduleId || null;
            this.moduleName = defaultData.moduleName || null;
            this.pageDesc = defaultData.pageDesc || null;
            this.pageId = defaultData.pageId || null;
            this.pageName = defaultData.pageName || null;
            this.mainPageId = defaultData.mainPageId || null;
            this.mainPageName = defaultData.mainPageName || null;
            this.sectionId = defaultData.sectionId || null;
            this.sectionName = defaultData.sectionName || null;
            this.sectionDesc = defaultData.sectionDesc || null;
            this.fieldId = defaultData.fieldId || null;
            this.name = defaultData.name || null; // field name 
            this.sh = defaultData.sh || null;  // short header
            this.fh = defaultData.fh || null;  // full header
            this.fieldDesc = defaultData.fieldDesc || null;
            this.dataType = defaultData.dataType || null;
            this.maxLength = defaultData.maxLength || null;
            this.minLength = defaultData.minLength || null;
            this.scale = defaultData.scale || null;
            this.length = defaultData.length || null;
            this.isMandatory = defaultData.isMandatory || false;
            this.permValues = defaultData.permValues || null;
            this.isEditable = defaultData.isEditable || false;
            this.inputTypeId = defaultData.inputTypeId || null;
            this.inputTypeName = defaultData.inputTypeName || null;
            this.shortFullTypeVal = defaultData.shortFullTypeVal || null;
            this.shortFullTypeName = defaultData.shortFullTypeName || null;
            this.appName = defaultData.appName || null;
            this.applicationId = defaultData.applicationId || null;
        }

    }]);