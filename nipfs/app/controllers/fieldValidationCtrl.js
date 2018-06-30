var app = angular.module('app');

app.controller('fieldValidationCtrl', ['$scope', '$rootScope', 'fieldValidationModelSvc', 'fieldValidationDataSvc', '$q', '$timeout', 'commonDataSvc', '$modal', '$http',
function ($scope, $rootScope, modelSvc, dataSvc, $q, $timeout, comnDataSvc, $modal, $http) {

    // scope variable
    var vm = $scope;


    // variable binding  
    vm.fieldValidation = {};  // define main object 
    var tempFieldValidationObj = {};  // temp object 

    vm.isCancelBtnHide = true;  // hide cancel btn
    vm.isPaginationOptionChange = false;  // pagination range option  change  

    vm.applicationList = []; // all application list 
    vm.fieldValidatonList = []; // all field validatoin list 
    vm.isCancelBtnHide = true;  // cance btn hide 
    vm.rangeList = [];  // a-z letter 
    vm.appObj = {}; // application object 
    vm.allFieldValidationData = []; // contain all field validation data 
    var appFieldValidatonList = [];  // application wise field list 
    vm.alphabetWiseFieldList = [];   // alphabet wise field list 
    vm.fieldList = [];  // grid data list 
    vm.isNameChange = false;   // is name change by datalist input field 

    // to copy validation 
    vm.cloneAppFieldObj = {};   // object for copy one application  to another application 


    // method binding 
    vm.getAppInfo = getAppInfo;
    vm.fValueKeyDown = fValueKeyDown;
    vm.fValueKeyUp = fValueKeyUp;
    vm.nameOnchange = nameOnchange;
    vm.selectedAlphabet = selectedAlphabet;
    vm.submitForm = submitForm;
    vm.reset = reset;
    vm.cancel = cancel;
    vm.isCancelBtnHide = cancel;
    vm.editEntity = editEntity;  // edit field field validtion data 
    vm.deleteEntity = deleteEntity;  // delete field validation data from server 
    vm.crateXML = crateXML;

    // validaton message copy 
    vm.toAppObj = {};
    vm.fromAppObj = {};
    vm.appCheckChange = appCheckChange;
    vm.getAppInfoToCopy = getAppInfoToCopy;
    vm.openAppValidationdModal = openAppValidationdModal; // open modal field data 


    // populate field validation data 
    vm.populateFieldValidation = populateFieldValidation;

    // create json file  from array list > EN xml
    function crateXML() {
        try {

            var opts = {
                templateUrl: 'app/views/generateFieldXML.html',
                controller: 'generateFieldValidationXMLCtrl',
                scope: $scope
            };

            $modal.open(opts);

        } catch (e) {
            showErrorMsg(e);
        }
    }


    // initialize 
    _int();

    function _int() {
        try {
            // get range 
            vm.rangeList = modelSvc.getRangeList();

            // page loading set default value 
            _setDefaultValue();

            _getServerData();

        } catch (e) {
            showErrorMsg(e);
        }
    }

    // get server data 
    function _getServerData() {
        try {
            var tick = (new Date()).getTime().toString();

            $q.all([
                 comnDataSvc.getAppData(tick),  // get application data 
                 dataSvc.getFieldValidation(tick)

            ]).then(function (data) {
                $timeout(function () {

                    // application list 
                    vm.applicationList = angular.copy(data[0]);
                    vm.allFieldValidationData = angular.copy(data[1]);

                    search(vm.allFieldValidationData);
                }, 0);
            }).catch(function (e) {
                showErrorMsg(e);
            });
        } catch (e) {
            showErrorMsg(e);
        }
    }

    // select application
    // application data onchange
    function getAppInfo(entity) {
        try {

            vm.fieldValidation.applicationId = entity._id;
            // application wise field list 
            appFieldValidatonList.length = 0;

            appFieldValidatonList = Enumerable.From(vm.allFieldValidationData).Where(function (x) {
                return x.applicationId === entity._id;
            }).ToArray();


            vm.isPaginationOptionChange = false;  // pagination option change 
            vm.criteria.page = 1;  // set page no. when new data is loaded 

            if (vm.fieldValidation.alphabet) {
                // alphabet wise field validation
                getAppFieldValidation();
            } else {
                // prepare grid data
                search(appFieldValidatonList);
            }


            vm.isCancelBtnHide = false;  // hide cancel button 
        } catch (e) {
            showErrorMsg(e);
        }
    }

    // select alphabet 
    function selectedAlphabet() {
        try {

            vm.isPaginationOptionChange = false;  // pagination option change 
            vm.criteria.page = 1;  // set page no. when new data is loaded 

            if (vm.fieldValidation.alphabet) {

                // alphabet wise field validation
                getAppFieldValidation();

            } else {
                // prepare grid data
                search(appFieldValidatonList);
            }

            vm.fieldValidation.name = null;
            vm.fieldValidation.message = null;

            vm.fieldValidationForm.$setPristine();

        } catch (e) {
            showErrorMsg(e);
        }
    }


    // alphabet wise field validation
    function getAppFieldValidation() {
        try {
            vm.alphabetWiseFieldList.length = 0;

            vm.alphabetWiseFieldList = Enumerable.From(vm.allFieldValidationData).Where(function (x) {
                return x.alphabet === vm.fieldValidation.alphabet && x.applicationId === vm.fieldValidation.applicationId;
            }).ToArray();



            // prepare grid data
            search(vm.alphabetWiseFieldList);
        } catch (e) {
            showErrorMsg(e);
        }
    }

    // Field Value Key Up & Down event
    function fValueKeyDown(e) {
        try {
            if (vm.fieldValidation.alphabet) {
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
            if (vm.fieldValidation.alphabet) {
                var indexKeyCode = vm.fieldValidation.alphabet.charCodeAt(0);
                if (vm.fieldValidation.name) {
                    var sub = vm.fieldValidation.name.substring(0, 1);
                    var key = sub.toUpperCase();
                    var keyCode = key.charCodeAt(0);
                    vm.fieldValidation.name = modelSvc.capitaliseFirstLetter(vm.fieldValidation.name);
                    if (keyCode != indexKeyCode) {
                        vm.fieldValidation.name = null;
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

    // name on  change 
    function nameOnchange(name) {
        try {
            if (vm.isEdit || !name)
                return;

            vm.fieldValidationForm.$setPristine();  // set page reset
            vm.fieldValidationForm.$setDirty();  // set page dirty


            var obj = Enumerable.From(vm.alphabetWiseFieldList).FirstOrDefault(null, function (x) {
                return x.name.toLowerCase() === name.toLowerCase();
            });
            if (obj) {

                vm.isNameChange = true;  // is name chage by existing data 

                // set value 
                angular.extend(vm.fieldValidation, obj);

                tempFieldValidationObj = angular.copy(vm.fieldValidation);

                vm.isCancelBtnHide = false;

            } else {

                if (vm.isNameChange) {
                    vm.fieldValidation = new fieldValidation({
                        alphabet: vm.fieldValidation.alphabet,
                        name: vm.fieldValidation.name,
                        applicationId: vm.fieldValidation.applicationId
                    });

                    vm.isNameChange = false;
                } else {
                    vm.fieldValidation._id = null;
                }
            }
        } catch (e) {
            showErrorMsg(e);
        }
    }

    // save or dupdate data 
    function submitForm() {
        try {

            var fieldList = Enumerable.From(vm.allFieldValidationData).Where(function (x) {
                return x.alphabet === vm.fieldValidation.alphabet && x.applicationId === vm.fieldValidation.applicationId;
            }).ToArray();

            if (vm.fieldValidation._id) {  // update data
                if (!modelSvc.checkUpdateDuplicateEntry(vm.fieldValidation, tempFieldValidationObj, fieldList)) {  // check duplicate to update 

                    dataSvc.saveOrUpdate(vm.fieldValidation).then(function (result) {

                        _afterUpdate(result.data);

                    }).catch(function (e) {
                        showErrorMsg(e);
                    });

                } else {
                    showDuplicateMsg();
                }

            } else {  // insert data 

                if (!modelSvc.checkDuplicateEntry(vm.fieldValidation, fieldList)) {

                    dataSvc.saveOrUpdate(vm.fieldValidation).then(function (result) {
                        //$timeout(function () {
                        var data = result.data;

                        _afterSave(data);

                        // }, 0);
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

    function _afterSave(entity) {
        try {

            // grid data update 
            _addnewData(entity);

            vm.fieldValidation._id = null;
            vm.fieldValidation.name = null;
            vm.fieldValidation.message = null;

            showSuccessSaveMsg();

            vm.fieldValidationForm.$setPristine();
        } catch (e) {
            showErrorMsg(e);
        }
    }

    function _addnewData(entity) {
        try {


            vm.allFieldValidationData.push(entity);

            vm.alphabetWiseFieldList.length = 0;

            var selectedList = Enumerable.From(vm.allFieldValidationData).Where(function (x) {
                return x.alphabet == entity.alphabet && x.applicationId === entity.applicationId;
            }).OrderBy("$.name").ToArray();

            vm.alphabetWiseFieldList = angular.copy(selectedList);

            vm.isPaginationOptionChange = false; // set pagination 
            search(vm.alphabetWiseFieldList);

        } catch (e) {
            showErrorMsg(e);
        }
    }

    function _afterUpdate(entity) {
        try {

            var index = -1;

            var appInfo = Enumerable.From(vm.fieldList).FirstOrDefault(null, function (x) {
                return x._id === entity.applicationId;
            });

            var alphabetInfo = Enumerable.From(appInfo.alphabetList).FirstOrDefault(null, function (x) {
                return x.index === entity.refIndex;
            });

            index = _findIndexByKeyValue(alphabetInfo.fieldValidationList, "_id", entity._id);
            if (index > -1) {  // update property by index no.
                //_updateObjectProperty(alphabetInfo.fieldValidationList[index], entity);
                angular.extend(alphabetInfo.fieldValidationList[index], entity);
            }

            // update all current data list 
            index = _findIndexByKeyValue(vm.allFieldValidationData, "_id", entity._id);
            if (index > -1)
                //_updateObjectProperty(vm.allFieldValidationData[index], entity);
                angular.extend(vm.allFieldValidationData[index], entity);

            // update alphabet wise data 
            index = _findIndexByKeyValue(vm.alphabetWiseFieldList, "_id", entity._id);
            if (index)
                angular.extend(vm.alphabetWiseFieldList[index], entity);


            vm.fieldValidation._id = null;
            vm.fieldValidation.name = null;
            vm.fieldValidation.message = null;
            vm.isEdit = false;

            showSuccessUpdateMsg();
            vm.fieldValidationForm.$setPristine();

        } catch (e) {
            showErrorMsg(e);
        }
    }

    function editEntity(editedEntity) {
        try {
            // javascript confirm message 
            if (vm.fieldValidationForm.$dirty) {
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
    }

    function _selectDataForEditing(entity) {
        try {


            vm.isPaginationOptionChange = false;  // pagination option change 
            vm.isEdit = true;  // set edited flage
            vm.isCancelBtnHide = false;  // show cancel btn 

            vm.fieldValidation = angular.copy(entity);
            tempFieldValidationObj = angular.copy(entity);

            // showing paginaton with data
            vm.alphabetWiseFieldList.length = 0;
            vm.alphabetWiseFieldList = Enumerable.From(vm.allFieldValidationData).Where(function (x) {
                return x.alphabet === entity.alphabet && x.applicationId === entity.applicationId;
            }).OrderBy("$.name").ToArray();

            // application data show into application dropdown field
            vm.appObj.selected = _getAppInfo(entity.applicationId);

            var index = _findIndexByKeyValue(vm.alphabetWiseFieldList, "_id", entity._id);

            // set page in the pagination 
            vm.criteria.page = Math.ceil((index + 1) / vm.criteria.pagesize);

            search(vm.alphabetWiseFieldList);

            vm.fieldValidationForm.$setPristine();
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


    function deleteEntity(entity) {
        try {

            var result = confirm("Are you sure you want to delete permamently?If yes, press ok.");
            if (result) {
                dataSvc.deleteEntity(entity).then(function (success) {
                    _afterDelete(entity);

                    _updateGridData(entity);
                   
                }).catch(function (e) {
                    showErrorMsg(e);
                });
            }

        } catch (e) {
            showErrorMsg(e);
        }
    }

    function _afterDelete(entity) {
        try {
            if (vm.fieldValidation._id === entity._id) {

                vm.fieldValidation._id = null;
                vm.fieldValidation.name = null;
                vm.fieldValidation.message = null;
                vm.isNameChange = false;   // is name change by datalist input field 
            }

            showSuccessDeletedMsg();
        } catch (e) {
            showErrorMsg(e);
        }
    }

    // update grid data after delete 
    function _updateGridData(entity) {
        try {

            var index = -1;
            index = _findIndexByKeyValue(vm.allFieldValidationData, "_id", entity._id);
            if (index > -1)
                vm.allFieldValidationData.splice(index, 1);

            if (!vm.fieldValidation.applicationId && !vm.fieldValidation.alphabet) {
                search(vm.allFieldValidationData);
                return;
            } else if (vm.fieldValidation.alphabet) {
                vm.alphabetWiseFieldList.length = 0;
                vm.alphabetWiseFieldList = Enumerable.From(vm.allFieldValidationData).Where(function (x) {
                    return x.applicationId === vm.fieldValidation.applicationId && x.alphabet === vm.fieldValidation.alphabet;
                }).ToArray();

                search(vm.alphabetWiseFieldList);
                return;

            } else if (vm.fieldValidation.applicationId) {
                appFieldValidatonList.length = 0;

                appFieldValidatonList = Enumerable.From(vm.allFieldValidationData).Where(function (x) {
                    return x.applicationId === vm.fieldValidation.applicationId;
                }).ToArray();

                search(appFieldValidatonList);
                return;
            }


        } catch (e) {
            showErrorMsg(e);
        }
    }

    function reset() {
        try {

            if (vm.fieldValidation._id) {

                vm.fieldValidation = angular.copy(tempFieldValidationObj);

            } else {

                _setDefaultValue();

                search(vm.allFieldValidationData);
            }

            vm.fieldValidationForm.$setPristine();  // form pristine 

        } catch (e) {
            showErrorMsg(e);
        }
    }

    function cancel() {
        try {
            // page loading set default value 
            _setDefaultValue();

            search(vm.allFieldValidationData);

            vm.fieldValidationForm.$setPristine();  // form pristine 

        } catch (e) {
            showErrorMsg(e);
        }
    }

    function _setDefaultValue() {
        try {
            vm.fieldValidation = new fieldValidation();
            vm.tempFieldValidationObj = {}; // hold temp object 
            vm.isCancelBtnHide = true;  // cance btn hide 
            vm.isEdit = false;
            vm.appObj = {}; // application object entity 

            vm.isPaginationOptionChange = false;  // pagination range option  change 
            vm.isNameChange = false;   // is name change by datalist input field 

        } catch (e) {
            showErrorMsg(e);
        }
    }

    // pagination custom criteria
    vm.criteria = {
        page: 1,  // no. of page 
        pagesize: 10   // showing data into one page 

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
                if (vm.fieldValidation.alphabet != null) {
                    search(vm.alphabetWiseFieldList);
                } else {
                    if (vm.fieldValidation.applicationId) {  // if application is exist 
                        search(appFieldValidatonList);
                    } else {
                        search(vm.allFieldValidationData);
                    }

                }
            } else {
                vm.criteria.page = 1;
            }
        }
    }, true);

    // grid data manamge with pagination
    function search(flatObjectArrayList) {
        try {


            // set order 
            flatObjectArrayList = Enumerable.From(flatObjectArrayList).Where(function (x) {
                return x;
            }).OrderBy("$.applicationId").ThenBy("$.alphabet").ThenBy("$.name").ToArray();

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
                        name: appInfo.name
                    });
                    appObjNew.alphabetList.push(_getAlphabetObj(data[i]));
                    vm.fieldList.push(appObjNew);
                } else {
                    var oldAlphabet = Enumerable.From(appObj.alphabetList).FirstOrDefault(null, function (x) {
                        return x.alphabet == data[i].alphabet;
                    });
                    if (!oldAlphabet) {
                        appObj.alphabetList.push(_getAlphabetObj(data[i]));
                    } else {
                        oldAlphabet.fieldValidationList.push(_getFieldValidationObj(data[i]));
                    }
                }
            }

            // var list = vm.fieldList;

        } catch (e) {
            showErrorMsg(e);
        }
    }

    // get alphabet object 
    function _getAlphabetObj(entity) {
        try {

            var fieldObj = new alphabetModel({
                alphabet: entity.alphabet

            });

            fieldObj.fieldValidationList.push(_getFieldValidationObj(entity));

            return fieldObj;
        } catch (e) {
            showErrorMsg(e);
        }
    }

   // push child list into parent object list 
    function _getFieldValidationObj(entity) {
        try {
            var obj = new fieldValidation({

                _id: entity._id,
                applicationId: entity.applicationId,
                alphabet: entity.alphabet,
                name: entity.name,
                message: entity.message
            });
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

    // object model  
    function application(defaultData) {
        defaultData = defaultData || {};
        this._id = defaultData._id || null;
        this.name = defaultData.name || null;
        this.alphabetList = [];
    }

    function alphabetModel(defaultData) {
        defaultData = defaultData || {};
        this.alphabet = defaultData.alphabet || null;
        this.fieldValidationList = [];
    }

    // object defination 
    function fieldValidation(defaultData) {
        defaultData = defaultData || {};
        this._id = defaultData._id || null;
        this.alphabet = defaultData.alphabet || null;
        this.name = defaultData.name || null;
        this.message = defaultData.message || null;
        this.applicationId = defaultData.applicationId || null;
    }



    // ****************************************************************************************** //
    // *************************************  Populate field validatio**************************** //
    // ****************************************************************************************** //


    var populatedFiledList = [];

    function populateFieldValidation() {
        try {

            return $http.get("app/xml/ValidationMessage.xml",   /// Garments.xml , HRM.xml , common.xml, admin.xml, admin.xml
               {
                   transformResponse: function (cnv) {
                       var x2js = new X2JS();
                       var aftCnv = x2js.xml_str2json(cnv);
                       return aftCnv;
                   }
               })
            .success(function (response) {
                // json object to array data list 

                for (var property in response.ValidationMessages) {
                    if (response.ValidationMessages.hasOwnProperty(property)) {
                        // create list from json object 
                        _arryListfromJsonObj(property, response.ValidationMessages[property]);
                    }
                }

                //// save to server data 
                //dataSvc.saveFieldValidations(populatedFiledList).then(function (data) {

                //    showSuccessSaveMsg();
                //});


            });
        } catch (e) {
            showErrorMsg(e);
        }
    }


    // create array list from json object 
    function _arryListfromJsonObj(range, rangProperty) {
        try {
            if (!rangProperty.ValidationMessage)
                return;
            for (var i = 0; i < rangProperty.ValidationMessage.length; i++) {
                // add to list 
                populatedFiledList.push(_addFieldTitle(range, rangProperty.ValidationMessage[i]));
            }





        } catch (e) {
            showErrorMsg(e);
        }
    }


    // prepare new object property
    function _addFieldTitle(letter, entity) {
        try {
            var obj = new fieldValidation({

                alphabet: letter,
                name: entity._Value,
                message: entity._Description,
                applicationId: "56fb4c7197a4510c0b0f5d57"   // application id 
            });
            return obj;
        } catch (e) {
            showErrorMsg(e);
        }
    }



    // ********************** copy validation from one to another app

    function appCheckChange(isCheck) {
        try {
           
            _setDefaultValue();

            search(vm.allFieldValidationData);
            vm.fieldValidationForm.$setPristine();  // form pristine 
            
            if (!isCheck) {
                vm.toAppObj = {};
                vm.fromAppObj = {};
                vm.cloneAppFieldObj = new cloneAppField({ isAppFieldCopy: isCheck });
            }
        } catch (e) {
            showErrorMsg(e);
        } 
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

    // object to copy all data to another application 
    function cloneAppField(defaultData) {
        defaultData = defaultData || {};
        this.toApplicationId = defaultData.toApplicationId || null;
        this.fromApplicationId = defaultData.fromApplicationId || null;
        this.isAppFieldCopy = defaultData.isAppFieldCopy || false;
    }

    // open field data into modla 
    function openAppValidationdModal() {
        try {
            if (vm.cloneAppFieldObj.toApplicationId == vm.cloneAppFieldObj.fromApplicationId)
                return;

            // open modal 
            var opts = {
                templateUrl: 'app/views/fieldValidationModal.html',
                controller: 'modalFieldValidationCtrl',
                scope: $scope
            };

            $modal.open(opts);
        } catch (e) {
            showErrorMsg(e);
        }
    };


    // refresh all data after copy one applicaiton field to another 
    $rootScope.$on('reloadFeildValidationData', function (event, args) {
        $timeout(function () {
            // page loading set default value 
            _setDefaultValue();
            _getServerData();

            vm.toAppObj = {};       // defalut to application 
            vm.fromAppObj = {}; // defalut from application 
            vm.cloneAppFieldObj = new cloneAppField({ isAppFieldCopy: false });
        }, 0);
    });


    // applicationId: "56f220ec049af984165ccbf2"   // 	KDCA
    // applicationId: "56fb4c7197a4510c0b0f5d57"   // 	Acc,
    // applicationId: "57b29f5357e7086803174ed3"   // 	HRM,



}]);