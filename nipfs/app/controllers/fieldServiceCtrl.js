var app = angular.module('app');

app.controller('fieldServiceCtrl', ['$scope', '$rootScope', '$q', '$timeout', 'fieldModelSvc', '$http', 'fieldDataSvc', '$modal', 'commonDataSvc',
    function ($scope, rootScope, q, $timeout, modelSvc, $http, fieldDataSvc, $modal, comnDataSvc) {

        var vm = $scope;

        // binding variable
        //  vm.languageList = []; // language list 
        vm.rangeList = []; // Alphabetic Range list 
        vm.dataTypeList = [];  // data type list
        vm.field = {};
        vm.fieldDetail = {};
        // page view list
        vm.fieldList = [];
        // field specification list 
        vm.fieldSpecsList = [];
        // application list 
        vm.applicationList = [];
        vm.appFieldList = [];   // application wise field list 
        // search option
        vm.searchCriteria = [];
        // store eitded data use whene undo
        vm.tmpFieldDtl = {};
        vm.fieldRange = {};
        vm.isCancelBtnHide = true;   // is showing cancel button 
        vm.isNameChange = false;   // is name change by datalist input field 
        vm.isBangali = false;   // uncheck is bangali checkbox 
        vm.bengaliObj = {};
        vm.appObj = {};     // application object entity 
        vm.toAppObj = {};
        vm.fromAppObj = {};

        vm.cloneAppFieldObj = {};   // object for copy one application field to another application field 
        vm.EN = false;  // for english or bangali xml generate falg

        // binding method 
        vm.appCheckChange = appCheckChange;
        vm.selectedRange = selectedRange;   // select alphabetical range 
        vm.selectedDataType = selectedDataType;
        vm.setLength = setLength;
        vm.setFhShEng = setFhShEng; // set full header and short header by eng label on change 
        vm.setFhShBan = setFhShBan;  // set full heder and short header by bangla label on change  

        // key up and key down method 
        vm.fValueKeyDown = fValueKeyDown;
        vm.fValueKeyUp = fValueKeyUp;
        vm.fLabelKeyDown = fLabelKeyDown;
        vm.fLabelKeyUp = fLabelKeyUp;
        vm.fFHeadKeyDown = fFHeadKeyDown;
        vm.fFHeadKeyUp = fFHeadKeyUp;
        vm.fSHeadKeyDown = fSHeadKeyDown;
        vm.fSHeadKeyUp = fSHeadKeyUp;
        vm.checkUncheckChekBox = checkUncheckChekBox;  // is bangali check and uncheck 
        //vm.nameOnBlur = nameOnBlur;  // select name from autocomplete then set another value against it 
        vm.nameOnchange = nameOnchange;  // on change autocomplete name list 
        vm.getAppInfo = getAppInfo; // application onchange 
        vm.getAppInfoToCopy = getAppInfoToCopy;

        // save and update data 
        vm.submitForm = submitForm;
        vm.reset = reset;   // reset data 
        vm.cancel = cancel;  // cancel and initialize page 

        vm.refreshButtonEvent = refreshButtonEvent; // grid refresh 

        // open modal field data 
        vm.openAppFieldModal = openAppFieldModal;

        // grid view method 
        vm.deleteField = deleteField;   // delete property from grid view 
        vm.editField = editField;   // edite property from grid view 

        // create xml file from data list 
        vm.crateXML = crateXML;
        vm.crateXMLBN = crateXMLBN;

        // pagination 
        vm.selectedArrayList = [];   // selected list by index no.
        vm.flatObjectArrayList = [];  // all list get server  
        vm.isPaginationOptionChange = false;  // pagination range option  change  

        vm.jsonData = {};
        vm.saveJsonData = saveJsonData;

        // open field data into modla 
        function openAppFieldModal() {
            try {
                if (vm.cloneAppFieldObj.toApplicationId == vm.cloneAppFieldObj.fromApplicationId)
                    return;

                // open modal 
                var opts = {
                    templateUrl: 'app/views/fieldModal.html',
                    controller: 'modalFieldServiceCtrl',
                    scope: $scope
                };

                $modal.open(opts);


            } catch (e) {
                showErrorMsg(e);
            }
        };


        // generate field xml 
        function generateFieldXMX() {
            try {
                var opts = {
                    templateUrl: 'app/views/generateFieldXML.html',
                    controller: 'generateFieldXMLCtrl',
                    scope: $scope
                };
                $modal.open(opts);
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // create json file  from array list > EN xml
        function crateXML() {
            try {

                vm.EN = true;
                generateFieldXMX();  // open  modal page 

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // generate bangla XML
        function crateXMLBN() {
            try {

                vm.EN = false;   // generate xml for bangali
                generateFieldXMX();   // open modal page 

            } catch (e) {
                showErrorMsg();
            }
        }


        // save json data into mongodb
        function saveJsonData() {
            try {
                return $http.get("app/views/FieldsTitle.xml",
                {
                    transformResponse: function (cnv) {
                        var x2js = new X2JS();
                        var aftCnv = x2js.xml_str2json(cnv);
                        return aftCnv;
                    }
                })
             .success(function (response) {
                 vm.jsonData = response.Fields;

                 // save json data into server 
                 fieldDataSvc.saveJsonData(vm.jsonData).then(function () {
                 });
             });
            } catch (e) {
                showErrorMsg();
            }
        }

        //constractor 
        init();

        // ************************************** end pagination code **************** 

        //Initial function
        function init() {
            try {
                initialization(); // page initialize when page is loading  with validation message 
                loadDefaultData(); // load default data list 

                // initialize object to copy application field data 
                vm.cloneAppFieldObj = new cloneAppField();
                // get all field grid data 
                getAllFields();
            } catch (e) {
                showErrorMsg(e);  // show error message 
            }
        }

        // refresh all data after copy one applicaiton field to another 
        rootScope.$on('reloadFeildServiceData', function (event, args) {
            $timeout(function () {
                init();

                vm.toAppObj = {};       // defalut to application 
                vm.fromAppObj = {}; // defalut from application 

            }, 0);
        });



        // prevent free space into name field
        $scope.$watch('fieldDetail.name', function () {
            if (vm.fieldDetail.name)
                vm.fieldDetail.name = vm.fieldDetail.name.replace(/\s+/g, '');
        });


        // set length 
        function setLength(maxLength) {
            try {
                vm.fieldDetail.length = maxLength;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // set full header and short header by label change 
        function setFhShEng(label) {
            try {
                vm.fieldDetail.fh = label;
                vm.fieldDetail.sh = label;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // set full header short header by bangla label on change 
        function setFhShBan(lBangla) {
            try {
                vm.fieldDetail.fhBangla = lBangla;
                vm.fieldDetail.shBangla = lBangla;
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // page initialization 
        function initialization() {
            try {
                initEntry();
            } catch (e) {
                showErrorMsg(e);
            }
        }

        //Get all sections 
        function getAllFields() {
            try {
                var tick = (new Date()).getTime().toString();
              
                q.all([
                    fieldDataSvc.getAllFieldService(tick),
                    comnDataSvc.getAppData(tick)  // get application data 
                ]).then(function (data) {
                    $timeout(function () {

                        // application list 
                        vm.applicationList = angular.copy(data[1]);
                        vm.flatObjectArrayList = angular.copy(data[0]);
                        // prepare gird view and pagination
                        search(vm.flatObjectArrayList);
                    }, 0);
                }).catch(function (e) {
                    showErrorMsg(e);
                });
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // application data onchange
        function getAppInfo(entity) {
            try {

                // assaign application name 
                vm.fieldDetail = new field({ appName: "Of " + entity.name, applicationId: entity._id });

                vm.fieldRange = {};

                // show grid view according to application wise 
                _appWiseGridData(entity._id);

                vm.isCancelBtnHide = false;  // hide cancel button 
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // show grid view according to application wise 
        function _appWiseGridData(applicationID) {
            var fieldList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                return x.applicationId == applicationID;
            }).ToArray();

            _prepareFieldByApp(fieldList, true);
        }

        // get application info to copy fields 
        function getAppInfoToCopy(entity, isToEntity) {
            try {

                if (vm.appCopyForm.$dirty)
                    vm.appCopyForm.$dirty = true;

                if (isToEntity) {
                    vm.cloneAppFieldObj.toApplicationId = entity._id;
                } else {
                    vm.cloneAppFieldObj.fromApplicationId = entity._id;
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // prepare field data by application name 
        function _prepareFieldByApp(list) {
            try {
                vm.appFieldList.length = 0;
                vm.appFieldList = angular.copy(list);
                // prepare grid view data 
                search(vm.appFieldList);
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // prepare grid after get all data from server 
        function _preparedata(data) {
            try {
                vm.fieldList.length = 0;
                _prepareGrid(data);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare grid data list 
        function _prepareGrid(data) {
            try {

                for (var i = 0; i < data.length; i++) {
                    var appObj = Enumerable.From(vm.fieldList).FirstOrDefault(null, function (x) {
                        return x._id == data[i].applicationId;
                    });
                    if (!appObj) { // inesrt new application 
                        var appInfo = Enumerable.From(vm.applicationList).FirstOrDefault(null, function (x) {
                            return x._id == data[i].applicationId;
                        });
                        var appObjNew = new application({
                            _id: data[i].applicationId,
                            appName: appInfo.name,
                        });
                        appObjNew.alphabetList.push(_getAlphabetObj(data[i]));
                        vm.fieldList.push(appObjNew);
                    } else {
                        var oldAlphabet = Enumerable.From(appObj.alphabetList).FirstOrDefault(null, function (x) {
                            return x.index == data[i].refIndex;
                        });
                        if (!oldAlphabet) {
                            appObj.alphabetList.push(_getAlphabetObj(data[i]));
                        } else {
                            oldAlphabet.fieldDetails.push(_pushChildList(data[i]));
                        }
                    }
                }
                var list = vm.fieldList;

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get alphabet object 
        function _getAlphabetObj(entity) {
            try {
                var getRangeObj = Enumerable.From(vm.rangeList).FirstOrDefault(null, function (x) {
                    return x.name == entity.refIndex;
                });

                var fieldObj = new fields({
                    id: getRangeObj.id,
                    index: entity.refIndex,
                    applicationId: entity.applicationId,
                    range: getRangeObj.range,
                    objectName: entity.objectName

                });

                fieldObj.fieldDetails.push(_pushChildList(entity));

                return fieldObj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // push child list into parent object list 
        function _pushChildList(entity) {
            try {
                var obj = new field({
                    id: !entity._id ? entity.id : entity._id,
                    name: entity.name,
                    code: entity.code,
                    l: entity.l,
                    sh: entity.sh,
                    fh: entity.fh,
                    refIndex: entity.refIndex,
                    lBangla: entity.lBangla,
                    shBangla: entity.shBangla,
                    fhBangla: entity.fhBangla,
                    objectName: entity.objectName,
                    desc: entity.desc,
                    descBangla: entity.descBangla,
                    minLength: entity.minLength,
                    maxLength: entity.maxLength,
                    length: entity.length,
                    values: entity.values,
                    dataType: entity.dataType,
                    scale: entity.scale,
                    applicationId: entity.applicationId,
                });
                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // page init 
        function initEntry() {
            try {

                vm.appObj = {}; // application object entity 

                vm.field = new fields({});
                vm.fieldDetail = new field();
                vm.tmpFieldDtl = {};
                vm.isPaginationOptionChange = false;  // pagination range option  change  
                vm.isBangali = false;   // uncheck is bangali checkbox 
                vm.isEdit = false;
                vm.isNameChange = false;   // is name change by datalist input field 
                vm.selectedArrayList.length = 0;   // data list by reflex index
                vm.searchCriteria.length = 0;
                vm.isCancelBtnHide = true;   // hide cancel button 
                vm.fieldRange = {};
                vm.bengaliObj = {};
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // load default data list 
        function loadDefaultData() {
            try {

                // get range 
                vm.rangeList = modelSvc.getRangeList();

                // get data type list 
                vm.dataTypeList = modelSvc.getDataTypeList();

            } catch (e) {
                showErrorMsg(e);
            }
        }

        var preAlphabet = null;
        function selectedRange(index) {
            try {
                if (!vm.fieldForm.$invalid) {
                    var result = confirm("Your work is not being saved, do you want to change this without saving?");
                    if (result) {
                        _getDataByRange(index);
                    } else {
                        vm.fieldRange.index = preAlphabet;
                        return;
                    }
                } else {
                    _getDataByRange(index);
                }
                preAlphabet = index;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // check uncheck application field 
        function appCheckChange(isCheck) {
            try {
                initEntry();
                vm.fieldForm.$setPristine();  // form pristine 
                search(vm.flatObjectArrayList);

                if (!isCheck) {
                    vm.toAppObj = {};
                    vm.fromAppObj = {};
                    vm.cloneAppFieldObj = new cloneAppField({ isAppFieldCopy: isCheck });
                }
            } catch (e) {
                showErrorMsg();
            }
        }

        // get data by range 
        function _getDataByRange(index) {
            try {
                vm.fieldForm.$setPristine();  // reset form                
                vm.field.index = index;
                vm.isPaginationOptionChange = false;  // pagination option change 
                vm.criteria.page = 1;  // set page no. when new data is loaded 

                if (!index) {  // if alphabetic range is not selected 
                    vm.fieldDetail = new field({
                        applicationId: vm.fieldDetail.applicationId,
                        appName: vm.fieldDetail.appName
                    });
                    // show field list application wise  filed list 
                    var appFieldList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                        return x.applicationId == vm.fieldDetail.applicationId;
                    }).ToArray();

                    search(appFieldList);
                    return;
                } else {  // if alphabetic range is selected 
                    _alphabetWiseGridData(index, vm.fieldDetail.applicationId);
                }

                // set entry object
                vm.fieldDetail = new field({ applicationId: vm.fieldDetail.applicationId, appName: vm.fieldDetail.appName });

            } catch (e) {
                showErrorMsg(e);
            }
        }


        // filter grid data alphabetic range 
        function _alphabetWiseGridData(index, applicationId) {
            try {
                // get data by alphabetic range 
                vm.selectedArrayList.length = 0;
                vm.selectedArrayList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.refIndex == index && x.applicationId == applicationId;
                }).OrderBy("$.name").ToArray();

                // set pagination and prepare gird view 
                search(vm.selectedArrayList);
            } catch (e) {
                showErrorMsg(e);
            }
        }


        function checkUncheckChekBox(isCheck) {
            try {

                if (!isCheck) {  // uncheck is bangali checkbox

                    vm.bengaliObj = angular.copy(vm.fieldDetail);

                    //vm.fieldDetail.nameBangla = null;
                    vm.fieldDetail.lBangla = null;
                    vm.fieldDetail.shBangla = null;
                    vm.fieldDetail.fhBangla = null;
                    vm.fieldDetail.descBangla = null;

                } else {
                    if (vm.isEdit) {  // if data for updating 
                        vm.fieldDetail.lBangla = vm.tmpFieldDtl.lBangla;
                        vm.fieldDetail.shBangla = vm.tmpFieldDtl.shBangla;
                        vm.fieldDetail.fhBangla = vm.tmpFieldDtl.fhBangla;
                        vm.fieldDetail.descBangla = vm.tmpFieldDtl.descBangla;
                    } else { // for new insert 
                        vm.fieldDetail.lBangla = vm.bengaliObj.lBangla;
                        vm.fieldDetail.shBangla = vm.bengaliObj.shBangla;
                        vm.fieldDetail.fhBangla = vm.bengaliObj.fhBangla;
                        vm.fieldDetail.descBangla = vm.bengaliObj.descBangla;
                    }
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // name input field change operation  
        function nameOnchange(name) {
            try {
                if (vm.isEdit || !name)
                    return;

                vm.fieldForm.$setPristine();  // set page reset
                vm.fieldForm.$setDirty();  // set page dirty



                var obj = Enumerable.From(vm.selectedArrayList).FirstOrDefault(null, function (x) {
                    return x.name.toLowerCase() == name.toLowerCase();
                });
                if (obj) {

                    vm.isNameChange = true;  // is name chage by existing data 
                    //  check uncheck is bangali checkbox 
                    if (obj.lBangla) {
                        vm.isBangali = true;
                    } else {
                        vm.isBangali = false;
                    }
                    // set value 
                    angular.extend(vm.fieldDetail, obj);
                    vm.fieldDetail.id = obj._id;

                    vm.tmpFieldDtl = angular.copy(vm.fieldDetail);

                    vm.isCancelBtnHide = false;

                } else {

                    if (vm.isNameChange) {
                        vm.fieldDetail = new field({
                            refIndex: vm.fieldRange.index,
                            name: vm.fieldDetail.name,
                            applicationId: vm.fieldDetail.applicationId
                        });

                        vm.isNameChange = false;
                    } else {
                        vm.fieldDetail.id = null;
                        if (vm.fieldDetail._id)
                            vm.fieldDetail._id = null;
                    }
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // onchange data type 
        function selectedDataType() {
            try {
                vm.fieldDetail.scale = "";
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // Field Value Key Up & Down event
        function fValueKeyDown(e) {
            try {
                if (vm.field.index) {
                } else {
                    e.preventDefault();
                    selectAlphabeticRangeMsg();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }
        function fValueKeyUp(e) {
            try {
                if (vm.field.index) {
                    var indexKeyCode = vm.field.index.charCodeAt(0);
                    if (vm.fieldDetail.name) {
                        var sub = vm.fieldDetail.name.substring(0, 1);
                        var key = sub.toUpperCase();
                        var keyCode = key.charCodeAt(0);
                        vm.fieldDetail.name = capitaliseFirstLetter(vm.fieldDetail.name);
                        if (keyCode != indexKeyCode) {
                            vm.fieldDetail.name = null;
                            matchAlpRangeMsg();
                        }
                    }
                } else {
                    e.preventDefault();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }
        function fLabelKeyDown(e) {
            try {
                if (vm.field.index) {
                } else {
                    e.preventDefault();
                    selectAlphabeticRangeMsg();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }
        function fLabelKeyUp(e) {
            try {
                if (vm.field.index) {
                    var indexKeyCode = vm.field.index.charCodeAt(0);
                    if (vm.fieldDetail.l) {
                        var sub = vm.fieldDetail.l.substring(0, 1);
                        var key = sub.toUpperCase();
                        var keyCode = key.charCodeAt(0);
                        vm.fieldDetail.l = capitaliseFirstLetter(vm.fieldDetail.l);
                        //if (keyCode != indexKeyCode) {
                        //    vm.fieldDetail.l = null;
                        //    vm.fieldDetail.fh = null;
                        //    vm.fieldDetail.sh = null;
                        //    matchAlpRangeMsg();
                        //}
                    }
                } else {
                    e.preventDefault();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // Field Full Header Key Up & Down event
        function fFHeadKeyDown(e) {
            try {
                if (vm.field.index) {
                } else {
                    e.preventDefault();
                    selectAlphabeticRangeMsg();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }
        function fFHeadKeyUp(e) {
            try {
                if (vm.field.index) {
                    var indexKeyCode = vm.field.index.charCodeAt(0);
                    if (vm.fieldDetail.fh) {
                        var sub = vm.fieldDetail.fh.substring(0, 1);
                        var key = sub.toUpperCase();
                        var keyCode = key.charCodeAt(0);
                        vm.fieldDetail.fh = capitaliseFirstLetter(vm.fieldDetail.fh);
                        //if (keyCode != indexKeyCode) {
                        //    vm.fieldDetail.fh = null;
                        //    matchAlpRangeMsg();
                        //}
                    }
                } else {
                    e.preventDefault();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // Field Short Key Up & Down event
        function fSHeadKeyDown(e) {
            try {
                if (vm.field.index) {
                } else {
                    e.preventDefault();
                    selectAlphabeticRangeMsg();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }
        function fSHeadKeyUp(e) {
            try {
                if (vm.field.index) {
                    var indexKeyCode = vm.field.index.charCodeAt(0);
                    if (vm.fieldDetail.sh) {
                        var sub = vm.fieldDetail.sh.substring(0, 1);
                        var key = sub.toUpperCase();
                        var keyCode = key.charCodeAt(0);
                        vm.fieldDetail.sh = capitaliseFirstLetter(vm.fieldDetail.sh);
                        //if (keyCode != indexKeyCode) {
                        //    vm.fieldDetail.sh = null;
                        //    matchAlpRangeMsg();
                        //}
                    }
                } else {
                    e.preventDefault();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        //  capitailse the first letter
        function capitaliseFirstLetter(string) {
            try {
                return string.charAt(0).toUpperCase() + string.slice(1);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        //Page Reset method
        function reset() {
            try {
                // vldRslt.resetForm();
                if (typeof vm.field !== "undefined") {//change occured in form object
                    if (vm.isEdit) { //Reset in Edit (Get Original Values for selected data)

                        vm.fieldDetail = angular.copy(vm.tmpFieldDtl);
                        // reset grid data list with paging 
                        search(vm.selectedArrayList);
                    } else { //Reset in Insert (Make initialization for New Entry)
                        initEntry();
                        search(vm.flatObjectArrayList);
                        setFocus("range");  // set focus into alphabetic range  
                    }
                    vm.fieldForm.$setPristine();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        //Save Method
        function submitForm() {
            try {

                var fieldList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.refIndex == vm.fieldRange.index && x.applicationId == vm.fieldDetail.applicationId;
                }).ToArray();


                if (!vm.fieldDetail.id) { //Check to Save
                    if (!modelSvc.checkDuplicateEntry(vm.fieldDetail, fieldList)) {
                        _getDataForSaveOrUpdate();
                        vm.field.isEdit = false;

                        fieldDataSvc.saveOrUpdateFieldService(vm.field).then(function (result) {
                            $timeout(function () {
                                var data = result.data;
                                vm.fieldForm.$setPristine();
                                afterSave(data);

                                setFocus("name");  // set focus into field name 
                            }, 0);
                        }).catch(function (e) {
                            showErrorMsg(e);
                        });
                    } else {
                        showDuplicateMsg();
                    }
                } else { //For Update
                    _getDataForSaveOrUpdate();
                    vm.field.isEdit = true;

                    if (!modelSvc.checkUpdateDuplicateEntry(vm.fieldDetail, vm.tmpFieldDtl, fieldList)) {  // check duplicate to update 

                        fieldDataSvc.saveOrUpdateFieldService(vm.field).then(function (result) {
                            var data = result.fieldServiceData;
                            vm.fieldForm.$setPristine();

                            _afterUpdate(data);
                            // update pagination object array 
                            _updateOriginalDataList(data);

                            setFocus("name");  // set focus into field name 

                        }).catch(function (e) {
                            showErrorMsg(e);
                        });

                    } else {
                        showDuplicateMsg();
                    }
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // update original data list 
        function _updateOriginalDataList(entity) {
            try {
                var index = _findIndexByKeyValue(vm.flatObjectArrayList, "_id", entity._id);
                // udate object property 
                if (index > -1) {
                    _updateObjectProperty(vm.flatObjectArrayList[index], entity);
                }

                // update entity from selected object list 
                if (vm.field.index) {
                    var selectedIndex = _findIndexByKeyValue(vm.selectedArrayList, "_id", entity._id);
                    if (selectedIndex > -1) {
                        _updateObjectProperty(vm.selectedArrayList[selectedIndex], entity);
                    }
                }

                vm.selectedArrayList.length = 0;
                vm.selectedArrayList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.refIndex == entity.refIndex && x.applicationId == entity.applicationId;
                }).OrderBy("$.name").ToArray();

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

        // update update method and update gird view 
        function _afterUpdate(entity) {
            try {

                var appInfo = Enumerable.From(vm.fieldList).FirstOrDefault(null, function (x) {
                    return x._id == entity.applicationId;
                });

                var alphabetInfo = Enumerable.From(appInfo.alphabetList).FirstOrDefault(null, function (x) {
                    return x.index == entity.refIndex;
                });


                var index = _findIndexByKeyValue(alphabetInfo.fieldDetails, "id", entity._id);
                if (index > -1) {  // update property by index no.
                    _updateObjectProperty(alphabetInfo.fieldDetails[index], entity);
                }


                initEntry();
                vm.isCancelBtnHide = false;
                vm.field.index = entity.refIndex;   // set alphabetical letter
                vm.fieldRange.index = entity.refIndex;

                vm.fieldDetail.applicationId = entity.applicationId;

                // application data show into application dropdown field
                vm.appObj.selected = _getAppInfo(entity.applicationId);

                showSuccessUpdateMsg(); // show update success message
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // update object array property 
        function _updateObjectProperty(object, entity) {
            try {
                angular.extend(object, entity);
                object.id = entity._id;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare data to save 
        function _getDataForSaveOrUpdate() {
            try {
                if (vm.field.fieldDetails.length == 0) {
                    vm.field.fieldDetails = [];
                }
                vm.fieldDetail.refIndex = vm.field.index;
                vm.field.fieldDetails.push(vm.fieldDetail);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // after save update gird view and others operation 
        function afterSave(data) {
            try {

                initEntry();
                vm.isCancelBtnHide = false;
                vm.fieldRange.index = data.refIndex;
                vm.field.index = data.refIndex;   // set alphabetical letter
                _addToFlatObjectArrayList(data);

                vm.fieldDetail.applicationId = data.applicationId;
                // application data show into application dropdown field
                vm.appObj.selected = _getAppInfo(data.applicationId);

                showSuccessSaveMsg();

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // add to flate object arrary list 
        function _addToFlatObjectArrayList(entity) {
            try {

                vm.isPaginationOptionChange = false; // set pagination 

                var selectedList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.refIndex == entity.refIndex && x.applicationId == entity.applicationId;
                }).OrderBy("$.name").ToArray();

                vm.selectedArrayList = angular.copy(selectedList);
                vm.selectedArrayList.push(entity);

                // add data into main flat list 
                vm.flatObjectArrayList.push(entity);

                search(vm.selectedArrayList);

                var mainList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x;
                }).OrderBy("$.refIndex").ToArray();
                vm.flatObjectArrayList = angular.copy(mainList);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // clear change data and prepare for new entry
        function cancel() {
            try {
                initEntry();

                search(vm.flatObjectArrayList);

                vm.fieldForm.$setPristine();  // form pristine 

                setFocus("range");  // set focus into field name 
            } catch (e) {
                showErrorMsg(e);
            }
        };

        // grid refresh 
        function refreshButtonEvent() {
            try {
                
                var tick = (new Date()).getTime().toString();
                fieldDataSvc.getAllFieldService(tick).then(function (data) {
                    vm.flatObjectArrayList = angular.copy(data);

                    vm.isPaginationOptionChange = false;
                    vm.criteria.page = 1;

                    if (vm.fieldDetail.refIndex) // alphabetic range 
                        _alphabetWiseGridData(vm.fieldDetail.refIndex, vm.fieldDetail.applicationId);
                    else if (vm.fieldDetail.applicationId) // applicatoin wise 
                    // show grid view according to application wise 
                        _appWiseGridData(vm.fieldDetail.applicationId);
                    else
                        search(vm.flatObjectArrayList);
                });

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // ********************************* grid view's all  method implimentation ******************* 

        // edit grid data 
        function editField(editedEntity) {
            try {
                // javascript confirm message 
                if (vm.fieldForm.$dirty) {
                    var result = confirm("Your work is not being saved, do you want to change this without saving?");
                    if (result) {
                        _selectDataForEditing(editedEntity);
                    }
                } else {
                    _selectDataForEditing(editedEntity);
                }

            } catch (e) {
                showErrorMsg(e);
            }
        };

        // select data for editing 
        function _selectDataForEditing(editedEntity) {
            try {

                //  check uncheck is bangali checkbox 
                if (editedEntity.lBangla) {
                    vm.isBangali = true;
                } else {
                    vm.isBangali = false;
                }

                vm.isPaginationOptionChange = false;  // pagination option change 

                vm.fieldRange.index = editedEntity.refIndex;
                vm.isEdit = true;
                vm.field.index = editedEntity.refIndex;

                vm.tmpFieldDtl = angular.copy(editedEntity);
                vm.fieldDetail = angular.copy(editedEntity);

                vm.isCancelBtnHide = false;

                // showing paginaton with data
                vm.selectedArrayList.length = 0;
                vm.selectedArrayList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.refIndex == editedEntity.refIndex && x.applicationId == editedEntity.applicationId;
                }).OrderBy("$.name").ToArray();

                // application data show into application dropdown field
                vm.appObj.selected = _getAppInfo(editedEntity.applicationId, true);

                var index = _findIndexByKeyValue(vm.selectedArrayList, "_id", editedEntity.id);

                // set page in the pagination 
                vm.criteria.page = Math.ceil((index + 1) / vm.criteria.pagesize);

                search(vm.selectedArrayList);

                vm.fieldForm.$setPristine();
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get application info 
        function _getAppInfo(applicationId, isEdit) {
            try {
                var appInfo = Enumerable.From(vm.applicationList).FirstOrDefault(null, function (x) {
                    return x._id == applicationId;
                });

                vm.fieldDetail.appName = "Of " + appInfo.name;   // assaign application name 
                vm.fieldDetail.applicationId = appInfo._id;
                if (isEdit) {
                    vm.tmpFieldDtl.appName = "Of " + appInfo.name;   // assaign application name 
                    vm.tmpFieldDtl.applicationId = appInfo._id;
                }


                return appInfo;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // delete data from grid 
        function deleteField(entity) {
            try {
                var result = confirm("Are you sure you want to delete permamently?If yes, press ok.");
                if (result) {
                    fieldDataSvc.deleteFieldService(entity).then(function (success) {

                        if (success.data.isExist == true) {
                            usagesAnotherScopeMsg();
                        } else {
                            vm.isPaginationOptionChange = false;
                            // return deletedData;
                            if (vm.field.index == entity.refIndex) {
                                _afterDelete(entity);

                                //vm.valueList.length = 0;
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

        // page re arrange after delete 

        function _afterDelete(entity) {
            try {

                vm.field = new fields({});
                vm.fieldDetail = new field({ applicationId: entity.applicationId });

                vm.tmpFieldDtl = {};
                vm.isPaginationOptionChange = false;  // pagination range option  change  
                vm.isBangali = false;   // uncheck is bangali checkbox 
                vm.isEdit = false;
                vm.isNameChange = false;   // is name change by datalist input field 
                vm.selectedArrayList.length = 0;   // data list by reflex index 

                vm.searchCriteria.length = 0;
                vm.fieldRange = {};
                vm.bengaliObj = {};
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // update grid data 
        function _updateGridData(entity) {
            try {

                // delete deleted entity from main object list 
                var flatObjectIndex = _findIndexByKeyValue(vm.flatObjectArrayList, "_id", entity.id);
                if (flatObjectIndex > -1)
                    vm.flatObjectArrayList.splice(flatObjectIndex, 1);

                // delete entity from selected object list 
                if (vm.field.index) {

                    var selectedIndex = _findIndexByKeyValue(vm.selectedArrayList, "_id", entity.id);
                    if (selectedIndex > -1) {
                        vm.selectedArrayList.splice(selectedIndex, 1);
                        search(vm.selectedArrayList);
                    }
                } else {
                    if (vm.fieldDetail.applicationId) {
                        var fieldList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                            return x.applicationId == entity.applicationId;
                        }).ToArray();

                        search(fieldList);
                    } else {
                        search(vm.flatObjectArrayList);
                    }
                }
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
                    if (vm.fieldRange.index != null) {
                        search(vm.selectedArrayList);
                    } else {
                        if (vm.fieldDetail.applicationId) {  // if application is exist 
                            search(vm.appFieldList);
                        } else {
                            search(vm.flatObjectArrayList);
                        }

                    }
                } else {
                    vm.criteria.page = 1;
                }
            }
        }, true);

        function search(flatObjectArrayList) {
            try {

                // order by reflex index and name 
                flatObjectArrayList = Enumerable.From(flatObjectArrayList).Where(function (x) {
                    return x;
                }).OrderBy("$.applicationId").ThenBy("$.refIndex").ThenBy("$.name").ToArray();
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

        // object model  
        function application(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null;
            this.appName = defaultData.appName || null;
            this.alphabetList = [];
        }

        function fields(defaultData) {
            defaultData = defaultData || {};
            this.id = defaultData.id || 0;
            this.index = defaultData.index || null;
            this.range = defaultData.range || null;
            this.fieldDetails = [];
            this.isEdit = defaultData.isEdit || false;
            this.objectName = 'Fields';
            this.applicationId = defaultData.applicationId || null;
        }

        function field(defaultData) {
            defaultData = defaultData || {};
            this.id = defaultData.id || 0;
            this.name = defaultData.name || null;
            this.code = defaultData.code || null;
            this.l = defaultData.l || null;
            this.sh = defaultData.sh || null;
            this.fh = defaultData.fh || null;
            this.desc = defaultData.desc || null;
            this.objectName = 'Fields';
            this.refIndex = defaultData.refIndex || null;
            this.lBangla = defaultData.lBangla || null;
            this.shBangla = defaultData.shBangla || null;
            this.fhBangla = defaultData.fhBangla || null;
            this.descBangla = defaultData.descBangla || null;
            this.minLength = defaultData.minLength || null;
            this.maxLength = defaultData.maxLength || null;
            this.length = defaultData.length || null;
            this.values = defaultData.values || null;
            this.dataType = defaultData.dataType || null;
            this.scale = defaultData.scale || null;
            this.applicationId = defaultData.applicationId || null;
            this.appName = defaultData.appName || null;

        }

        // object to copy all data to another application 
        function cloneAppField(defaultData) {
            defaultData = defaultData || {};
            this.toApplicationId = defaultData.toApplicationId || null;
            this.fromApplicationId = defaultData.fromApplicationId || null;
            this.isAppFieldCopy = defaultData.isAppFieldCopy || false;
        }

    }]);