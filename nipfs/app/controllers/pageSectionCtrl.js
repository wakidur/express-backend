var app = angular.module('app');

app.controller('pageSectionCtrl', ['$scope', 'pageSectionModelSvc', 'pageSectionDataSvc', '$timeout',
    function ($scope, modelSvc, dataSvc, $timeout) {

        // scope variable
        var vm = $scope;

        // variable binding
        vm.pageSection = {};
        vm.isCancelBtnHide = false;
        vm.typeList = [];    // page type list  
        vm.rangeList = [];   // alphabetic range list 
        var previousAlphabet = null;  // hold old range value 
        var preTypeId = null;  // hold old type id 
        vm.flatObjectArrayList = [];  // all data list 
        vm.typeFlatObjArrayList = [];     // data list by type 
        vm.selectedArrayList = [];   // data list by range 
        vm.isPaginationOptionChange = false;  // pagination range option  change  
        vm.isEdit = false;
        vm.isNameChange = false;  // is name change by datalist input field 
        vm.masterDataList = [];   // grid data list to view
        vm.tempPageSection = {};  // temp page section object hold property 

        // method binding 
        vm.selectedType = selectedType;  // change type 
        vm.selectedRange = selectedRange;  // change range 
        vm.nameOnchange = nameOnchange;  // on change autocomplete name list 

        // key up and key down method 
        vm.fValueKeyDown = fValueKeyDown;
        vm.fValueKeyUp = fValueKeyUp;
        vm.titleENKeyDown = titleENKeyDown;
        vm.titleENKeyUp = titleENKeyUp;

        vm.submitForm = submitForm;  // save or update data 
        vm.deleteSection = deleteSection;
        vm.editSection = editSection;
        vm.cancel = cancel;
        vm.reset = reset;

        // create xml file from data list 
        vm.crateXML = crateXML;

        function crateXML() {
            try {
                var mainList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x;
                }).OrderBy("$.alphabet").ToArray();

                if (mainList.length == 0) {
                    fieldItemExistMsg();  // no  filed item under this application message 
                    return;
                }

                // create xml with all data 
                var obj = {};
                obj[vm.flatObjectArrayList[0].objectName] = {};
                obj[vm.flatObjectArrayList[0].objectName]["_xmlns:xs"] = "http://www.w3.org/2001/XMLSchema-instance";
                obj[vm.flatObjectArrayList[0].objectName]["_xmlns:xsd"] = "http://www.w3.org/2001/XMLSchema";


                // json mian object name come from server data 
                var tempAlphabet = "";
                for (var i = 0; i < mainList.length; i++) {
                    if (mainList[i].alphabet != tempAlphabet) {
                        tempAlphabet = mainList[i].alphabet;
                        // get propety by index 
                        var rangeObj = Enumerable.From(vm.rangeList).FirstOrDefault(null, function (x) {
                            return x.name == mainList[i].alphabet;
                        });
                        obj.Sections[mainList[i].alphabet] = new alphabeticObj({ _Range: rangeObj.range });  // all attribute in xml 
                    }



                    obj.Sections[mainList[i].alphabet].Section.push(_addSectionProperty(mainList[i]));
                }

                // generate xml data 
                var x2jsAll = new X2JS();
                var xmlAll = x2jsAll.json2xml_str(obj);

                // all attribute 
                var sectionXMLObj = {};
                sectionXMLObj["xml"] = xmlAll;

                // save xml document from server 
                dataSvc.saveXMLData(sectionXMLObj).then(function (data) {

                    //save English field  from client side 
                    var blob = new Blob([sectionXMLObj.xml], {
                        type: "application/xhtml+xml;charset=charset=utf-8"
                    });

                    //save file
                    saveAs(blob, "Sections" + ".xml");

                    //window.open('../app/xml/Sections.xml', '_blank', 'toolbar=0,location=0,menubar=0');
                    // return null ;
                });

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // add property into Name list 
        function _addSectionProperty(entity) {
            try {

                /*var typeObj = Enumerable.From(vm.typeList).FirstOrDefault(null, function (x) {
                    return x.id == entity.typeId;
                });*/

                var typeObj = _getPageTypeInfo(entity.typeId);

                var obj = new sectionObj({
                    _Code: entity.code,
                    _Name: entity.name,
                    _EST: entity.titleEN,
                    _BST: entity.titleBN,
                    _Type: typeObj.name,
                });
                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get page type info 
        function _getPageTypeInfo(id) {
            try {
                var typeObj = Enumerable.From(vm.typeList).FirstOrDefault(null, function (x) {
                    return x.id == id;
                });

                return typeObj;
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // Object declaration for xml 
        function alphabeticObj(defaultData) {
            defaultData = defaultData || {};
            this._Range = defaultData._Range || null;
            this.Section = [];
        }

        // Name object  property  for creating xml 
        function sectionObj(defaultData) {
            defaultData = defaultData || {};
            this._Name = defaultData._Name || null;
            this._Code = defaultData._Code || null;
            this._Type = defaultData._Type || null;
            this._EST = defaultData._EST || null;
            this._BST = defaultData._BST || null;
        }

        _init();

        function _init() {
            try {

                // page initialization
                _initPageSection();

                // get default values 
                _getDefaultValues();

                // get server data 
                getServerData();
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // page initialize 

        function _initPageSection() {
            try {

                vm.pageSection = new pageSection();
                vm.isCancelBtnHide = true;
                vm.isNameChange = false;  // is name change by datalist input field 
                vm.isPaginationOptionChange = false;  // pagination range option  change  
                vm.selectedArrayList.length = 0;   //  data list by range 
                vm.isEdit = false; // is edited data 
                vm.tempPageSection = {};

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prevent free space into name field
        $scope.$watch('pageSection.name', function () {
            if (vm.pageSection.name)
                vm.pageSection.name = vm.pageSection.name.replace(/\s+/g, '');
        });


        // get default values 
        function _getDefaultValues() {
            try {
                vm.rangeList = modelSvc.getRangeList();
                vm.typeList = modelSvc.getPageTypList();
            } catch (e) {
                showErrorMsg();
            }
        }

        // get server data 
        function getServerData() {
            try {
                var tick = (new Date()).getTime().toString();
                dataSvc.getPageSectionList(tick).then(function (result) {
                    // get flat object array list 
                    vm.flatObjectArrayList = angular.copy(result);

                    // prepare gird view and pagination
                    search(vm.flatObjectArrayList);
                });
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // Field Value Key Up & Down event
        function fValueKeyDown(e) {
            try {
                if (vm.pageSection.alphabet) {
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
                if (vm.pageSection.alphabet) {
                    var indexKeyCode = vm.pageSection.alphabet.charCodeAt(0);
                    if (vm.pageSection.name) {
                        var sub = vm.pageSection.name.substring(0, 1);
                        var key = sub.toUpperCase();
                        var keyCode = key.charCodeAt(0);
                        vm.pageSection.name = capitaliseFirstLetter(vm.pageSection.name);
                        if (keyCode != indexKeyCode) {
                            vm.pageSection.name = null;
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
        function titleENKeyDown(e) {
            try {
                if (vm.pageSection.alphabet) {
                } else {
                    e.preventDefault();
                    selectAlphabeticRangeMsg();
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }
        function titleENKeyUp(e) {
            try {
                if (vm.pageSection.alphabet) {
                    var indexKeyCode = vm.pageSection.alphabet.charCodeAt(0);
                    if (vm.pageSection.titleEN) {
                        var sub = vm.pageSection.titleEN.substring(0, 1);
                        var key = sub.toUpperCase();
                        var keyCode = key.charCodeAt(0);
                        vm.pageSection.titleEN = capitaliseFirstLetter(vm.pageSection.titleEN);
                        if (keyCode != indexKeyCode) {
                            vm.pageSection.titleEN = null;
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


        //  capitailse the first letter
        function capitaliseFirstLetter(string) {
            try {
                return string.charAt(0).toUpperCase() + string.slice(1);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // change type 

        function selectedType(id) {
            try {
                if (!vm.pageSecForm.$invalid) {
                    var result = confirm("Your work is not being saved, do you want to change this without saving?");
                    if (result) {
                        _getDataByTypeId(id);
                    } else {
                        vm.pageSection.typeId = preTypeId;
                        return;
                    }
                } else {
                    _getDataByTypeId(id);
                }
                preTypeId = id;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // chanage range 
        function selectedRange(index) {
            try {
                if (!vm.pageSection.typeId) {

                    vm.pageSecForm.$setPristine();  // reset form    
                    vm.pageSection.alphabet = "";

                    choseTypeMsg();

                    return;
                }

                if (!vm.pageSecForm.$invalid) {
                    var result = confirm("Your work is not being saved, do you want to change this without saving?");
                    if (result) {
                        _getDataByRange(index);
                    } else {
                        vm.pageSection.alphabet = previousAlphabet;
                        return;
                    }
                } else {
                    _getDataByRange(index);
                }
                previousAlphabet = index;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // populate grid data by type id 

        function _getDataByTypeId(id) {
            try {
                vm.pageSecForm.$setPristine();  // reset form    

                vm.isPaginationOptionChange = false;  // pagination option change 

                vm.criteria.page = 1;  // set page no. when new data is loaded 

                if (!id) { // if type is not selected 
                    vm.pageSection = new pageSection();

                    search(vm.flatObjectArrayList);
                    return;

                } else {

                    vm.isCancelBtnHide = false;

                    vm.typeFlatObjArrayList.length = 0;
                    vm.typeFlatObjArrayList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                        return x.typeId == id;
                    }).OrderBy("$.code").ToArray();


                    search(vm.typeFlatObjArrayList);

                    vm.pageSection = new pageSection({ typeId: vm.pageSection.typeId });

                }

            } catch (e) {
                showErrorMsg(e);
            }
        }


        // populate gird data by range value 
        function _getDataByRange(index) {
            try {
                vm.pageSecForm.$setPristine();  // reset form    

                vm.isPaginationOptionChange = false;  // pagination option change 

                vm.criteria.page = 1;  // set page no. when new data is loaded 

                if (!index) {  // if alphabetic range is not selected 

                    vm.pageSection = new pageSection();

                    // showing pagination with all data 
                    search(vm.flatObjectArrayList);
                    return;
                } else {  // if alphabetic range is selected 

                    // get data by alphabetic range 
                    vm.selectedArrayList.length = 0;
                    vm.selectedArrayList = Enumerable.From(vm.typeFlatObjArrayList).Where(function (x) {
                        return x.alphabet == index;
                    }).OrderBy("$.code").ToArray();

                    // set pagination and prepare gird view 
                    search(vm.selectedArrayList);

                    //vm.pageSection = new pageSection({ alphabet: vm.pageSection.alphabet });

                    vm.pageSection.alphabet = vm.pageSection.alphabet;
                    vm.pageSection.name = null;
                    vm.pageSection.titleEN = null;
                    vm.pageSection.titleBN = null;


                    // set code dynamically
                    _setCode(index);

                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // name input field change operation  
        function nameOnchange(name) {
            try {
                if (vm.isEdit)
                    return;

                vm.pageSecForm.$setPristine();  // set page reset
                vm.pageSecForm.$setDirty();  // set page dirty

                var obj = Enumerable.From(vm.selectedArrayList).FirstOrDefault(null, function (x) {
                    return x.name == name;
                });
                if (obj) {
                    vm.isNameChange = true;  // is name chage by existing data 
                    // set value 
                    angular.extend(vm.pageSection, obj);

                    vm.tempPageSection = angular.copy(vm.pageSection);
                } else {
                    if (vm.isNameChange) {
                        vm.pageSection = new pageSection({
                            typeId: vm.pageSection.typeId,
                            alphabet: vm.pageSection.alphabet,
                            name: vm.pageSection.name,
                        });

                        _setCode(vm.pageSection.alphabet);  // set code after name change  

                        vm.isNameChange = false;
                    } else {
                        vm.pageSection._id = null;

                        _setCode(vm.pageSection.alphabet);  // set code after name change  
                    }
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // set code after onchange name 
        function _setCode(index) {
            try {
                /*if (vm.selectedArrayList.length > 0) {
                    if (vm.selectedArrayList[vm.selectedArrayList.length - 1].code < _getRange(index)[1]) {
                        vm.pageSection.code = vm.selectedArrayList[vm.selectedArrayList.length - 1].code + 1;
                    } else {
                        vm.pageSection.code = null;
                        fieldUsagesCodeMsg();
                    }
                } else {
                    vm.pageSection.code = _getRange(index)[0];
                }*/

                if (vm.flatObjectArrayList.length > 0) {

                    var list = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                        return x.alphabet == index;
                    }).OrderBy("$.code").ToArray();

                    if (list.length > 0) {
                        if (list[list.length - 1].code < _getRange(index)[1]) {
                            vm.pageSection.code = list[list.length - 1].code + 1;
                        } else {
                            vm.pageSection.code = null;
                            fieldUsagesCodeMsg();
                        }
                    } else {
                        vm.pageSection.code = _getRange(index)[0];
                    }

                } else {
                    vm.pageSection.code = _getRange(index)[0];
                }
            } catch (e) {

            }
        }

        // get starting code by alphabet 
        function _getRange(index) {
            try {
                var selectedAlphabet = Enumerable.From(vm.rangeList).FirstOrDefault(null, function (x) {
                    return x.name == index;
                });
                return selectedAlphabet.range.split("-");
                // return codeRange;
            } catch (e) {

            }
        }

        // save or update data
        function submitForm() {
            try {
                // check duplicate data 
                if (!vm.pageSection._id) { // for save data
                    // check duplicate data 
                    if (!modelSvc.checkDuplicateEntry(vm.pageSection, vm.selectedArrayList)) {  // check duplicate update 
                        dataSvc.saveOrUpdateEntity(vm.pageSection).then(function (result) {
                            $timeout(function () {

                                afterSave(result.data);
                                // set code dynamically
                                _setCode(result.data.alphabet);

                            }, 0);
                        }).catch(function (e) {
                            showErrorMsg(e);
                        });
                    } else {
                        showDuplicateMsg();
                    }
                } else { // for update data 
                    if (!modelSvc.checkUpdateDuplicateEntry(vm.pageSection, vm.tempPageSection, vm.selectedArrayList)) {  // check duplicate update 
                        dataSvc.saveOrUpdateEntity(vm.pageSection).then(function (result) {
                            //var data = result.data;
                            vm.pageSecForm.$setPristine();

                            _afterUpdate(result.data);
                            // update pagination object array 
                            _updateOriginalDataList(result.data);

                            // set code dynamically 
                            _setCode(result.data.alphabet);

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

        // update update method and update gird view 
        function _afterUpdate(entity) {
            try {
                var parentObject = Enumerable.From(vm.masterDataList).FirstOrDefault(null, function (x) {
                    return x.typeId == entity.typeId;
                });


                if (parentObject) {
                    var alphabeticRangeObj = Enumerable.From(parentObject.rangeList).FirstOrDefault(null, function (x) {
                        return x.alphabet == entity.alphabet;
                    });

                    if (alphabeticRangeObj) {
                        var index = _findIndexByKeyValue(alphabeticRangeObj.pageSectonList, "_id", entity._id);
                        if (index > -1) {  // update property by index no.
                            _updateObjectProperty(alphabeticRangeObj.pageSectonList[index], entity);
                        }
                    }
                }
                /* var parentObject = Enumerable.From(vm.masterDataList).FirstOrDefault(null, function (x) {
                     return x.alphabet == entity.typeId;
                 });*/


                /* var index = _findIndexByKeyValue(parentObject.pageSectonList, "_id", entity._id);
                 if (index > -1) {  // update property by index no.
                     _updateObjectProperty(parentObject.pageSectonList[index], entity);
                 }
 */
                // initialize section page 
                _initPageSection();

                vm.isCancelBtnHide = false;

                vm.pageSection.typeId = entity.typeId;
                vm.pageSection.alphabet = entity.alphabet;

                vm.pageSecForm.$setPristine(); // reset form 
                showSuccessUpdateMsg(); // show update success message
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // update object array property 
        function _updateObjectProperty(object, entity) {
            try {
                angular.extend(object, entity);

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

                // update  entity from selected object list 
                if (vm.pageSection.alphabet) {
                    var selectedIndex = _findIndexByKeyValue(vm.selectedArrayList, "_id", entity._id);
                    if (selectedIndex > -1)
                        _updateObjectProperty(vm.selectedArrayList[selectedIndex], entity);
                }

                vm.selectedArrayList.length = 0;
                vm.selectedArrayList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.alphabet == entity.alphabet;
                }).OrderBy("$.code").ToArray();


            } catch (e) {
                showErrorMsg(e);
            }
        }

        // after save operation 
        function afterSave(data) {
            try {
                _initPageSection();
                vm.pageSection.typeId = data.typeId;
                vm.pageSection.alphabet = data.alphabet;
                _addToFlatObjectArrayList(data);
                vm.pageSecForm.$setPristine(); // reset form 
                showSuccessSaveMsg();  // show sucess message 

                vm.isCancelBtnHide = false;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // add saved data flat object list 
        function _addToFlatObjectArrayList(entity) {
            try {
                vm.isPaginationOptionChange = false; // set pagination 

                /*                var selectedList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                                    return x.alphabet == entity.alphabet;
                                }).OrderBy("$.typeId ,$.code").ToArray();
                
                                vm.selectedArrayList = angular.copy(selectedList);
                                vm.selectedArrayList.push(entity);*/

                // add data into main flat list 
                vm.flatObjectArrayList.push(entity);

                // search(vm.selectedArrayList);

                var mainList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x;
                }).OrderBy("$.typeId , $.alphabet, $.code").ToArray();

                vm.flatObjectArrayList = angular.copy(mainList);

                vm.typeFlatObjArrayList.length = 0;
                vm.typeFlatObjArrayList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.typeId == entity.typeId;
                }).OrderBy("$.alphabet, $.code").ToArray();

                vm.selectedArrayList.length = 0;
                if (vm.typeFlatObjArrayList.length > 0) {
                    vm.selectedArrayList = Enumerable.From(vm.typeFlatObjArrayList).Where(function (x) {
                        return x.alphabet == entity.alphabet;
                    }).OrderBy("$.code").ToArray();
                }

                search(vm.selectedArrayList);


            } catch (e) {
                showErrorMsg(e);
            }

        }

        // delete page section 
        function deleteSection(entity) {
            try {
                var result = confirm("Are you sure you want to delete permamently?If yes, press ok.");
                if (result) {
                    dataSvc.deleteSection(entity).then(function () {
                        vm.isPaginationOptionChange = false;
                        // return deletedData;
                        if (vm.pageSection.alphabet == entity.alphabet) {
                            _initPageSection();
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

        // update grid data 
        function _updateGridData(entity) {
            try {
                var parentObject = Enumerable.From(vm.masterDataList).FirstOrDefault(null, function (x) {
                    return x.alphabet == entity.alphabet;
                });

                var index = parentObject.pageSectonList.indexOf(entity);
                if (index > -1)
                    parentObject.pageSectonList.splice(index, 1);

                if (parentObject.pageSectonList.length == 0) {
                    // remove parent object 
                    var parentObj = Enumerable.From(vm.masterDataList).FirstOrDefault(null, function (x) {
                        return x.alphabet == entity.alphabet;
                    });

                    var parentIndex = vm.masterDataList.indexOf(parentObj);
                    if (parentIndex > -1)
                        vm.masterDataList.splice(parentIndex, 1);
                }

                // delete deleted entity from main object list 
                var flatObjectIndex = _findIndexByKeyValue(vm.flatObjectArrayList, "_id", entity._id);
                if (flatObjectIndex > -1)
                    vm.flatObjectArrayList.splice(flatObjectIndex, 1);

                // delete entity from selected object list 
                if (vm.masterDataList.alphabet) {
                    var selectedIndex = _findIndexByKeyValue(vm.selectedArrayList, "_id", entity._id);
                    if (selectedIndex > -1)
                        vm.selectedArrayList.splice(selectedIndex, 1);
                    search(vm.selectedArrayList);

                } else {
                    search(vm.flatObjectArrayList);
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // edit page section 
        function editSection(editedEntity) {
            try {
                // javascript confirm message 
                if (vm.pageSecForm.$dirty) {
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

        // select data for editing 
        function _selectDataForEditing(entity) {
            try {


                vm.isPaginationOptionChange = false;  // pagination option change 
                //vm.criteria.page = 1;  // set page no. when new data is loaded 

                vm.isEdit = true;
                vm.isCancelBtnHide = false;

                angular.extend(vm.pageSection, entity);
                vm.tempPageSection = angular.copy(entity);

                // get data by page type 
                vm.typeFlatObjArrayList.length = 0;
                vm.typeFlatObjArrayList = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.typeId == entity.typeId;
                }).OrderBy("$.code").ToArray();

                // showing paginaton with data

                if (vm.typeFlatObjArrayList.length > 0) {
                    vm.selectedArrayList.length = 0;
                    vm.selectedArrayList = Enumerable.From(vm.typeFlatObjArrayList).Where(function (x) {
                        return x.alphabet == entity.alphabet;
                    }).OrderBy("$.code").ToArray();

                    var index = _findIndexByKeyValue(vm.selectedArrayList, "_id", entity._id);
                    // set page in the pagination 
                    vm.criteria.page = Math.ceil((index + 1) / vm.criteria.pagesize);

                    search(vm.selectedArrayList);

                    vm.pageSecForm.$setPristine();
                }

            } catch (e) {
                showErrorMsg(e);
            }
        }

        //Page Reset method
        function reset() {
            try {
                if (vm.isEdit) { //Reset in Edit (Get Original Values for selected data)
                    vm.pageSection = angular.copy(vm.tempPageSection);

                    // reset grid data list with paging 
                    search(vm.selectedArrayList);
                } else { //Reset in Insert (Make initialization for New Entry)
                    _initPageSection();
                    search(vm.flatObjectArrayList);
                }
                vm.pageSecForm.$setPristine();

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // clear change data and prepare for new entry
        function cancel() {
            try {
                _initPageSection();

                search(vm.flatObjectArrayList);

                vm.pageSecForm.$setPristine();  // form pristine 

            } catch (e) {
                showErrorMsg(e);
            }
        };

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
                    if (vm.pageSection.alphabet != null) {
                        search(vm.selectedArrayList);
                    } else {
                        search(vm.flatObjectArrayList);
                    }
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
                }).OrderBy("$.alphabet").ThenBy("$.name").ToArray();
                
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

        // prepare data list to view 
        // prepare grid after get all data from server 
        function _preparedata(data) {
            try {
                vm.masterDataList.length = 0;
                _prepareGrid(data);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare grid data list 
        function _prepareGrid(data) {
            try {
                for (var i = 0; i < data.length; i++) {
                    var pageSectionObj = Enumerable.From(vm.masterDataList).FirstOrDefault(null, function (x) {
                        return x.typeId == data[i].typeId;
                    });


                    if (!pageSectionObj) { // module is not exist 

                        var typeObj = _getPageTypeInfo(data[i].typeId);

                        var pageTypeObj = new pageTypeModel({
                            typeId: data[i].typeId,
                            typeName: typeObj.name,
                        });
                        //  push data into master object 
                        pageTypeObj.rangeList.push(_pushRangeObj(data[i]));

                        // push master object into list 
                        vm.masterDataList.push(pageTypeObj);

                    } else { // module is exist 
                        var rangeObj = Enumerable.From(pageSectionObj.rangeList).FirstOrDefault(null, function (x) {
                            return x.alphabet == data[i].alphabet;
                        });
                        if (!rangeObj) {  // page list object is not exist into module 
                            // inset page's obj and also insert fieldSpecs's object 
                            pageSectionObj.rangeList.push(_pushRangeObj(data[i]));

                        } else {   // page object in exist into module 
                            // jush fieldSpecs push 
                            rangeObj.pageSectonList.push(_pushSectionList(data[i]));
                        }
                    }


                    /*if (!pageSectionObj) {

                        // master object 
                        var rangeModelObj = new rangeModel({
                            alphabet: data[i].alphabet,
                        });
                        //  push data into master object 
                        rangeModelObj.pageSectonList.push(_pushSectionList(data[i]));
                        vm.masterDataList.push(rangeModelObj); // push master list 

                    } else { // if data is exist into grid view list 
                        pageSectionObj.pageSectonList.push(_pushSectionList(data[i]));
                    }*/
                }

                // var list = vm.masterDataList;

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // push range 
        function _pushRangeObj(entity) {
            try {
                var obj = new rangeModel({
                    alphabet: entity.alphabet,
                });

                // push field info into page object list 
                obj.pageSectonList.push(_pushSectionList(entity));

                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // child data insert into master object 
        function _pushSectionList(entity) {
            try {

                var obj = new pageSection({
                    _id: entity._id,
                    alphabet: entity.alphabet,
                    code: entity.code,
                    typeId: entity.typeId,
                    name: entity.name,
                    titleEN: entity.titleEN,
                    titleBN: entity.titleBN,
                });
                return obj;
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

        // object model
        function pageTypeModel(defaultData) {
            defaultData = defaultData || {};
            this.typeId = defaultData.typeId || null;
            this.typeName = defaultData.typeName || null;
            this.rangeList = [];
        }

        function rangeModel(defaultData) {
            defaultData = defaultData || {};
            this.alphabet = defaultData.alphabet || null;
            this.pageSectonList = [];
        }

        function pageSection(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null;
            this.typeId = defaultData.typeId || null;
            this.alphabet = defaultData.alphabet || null;
            this.code = defaultData.code || null;
            this.name = defaultData.name || null;
            this.titleEN = defaultData.titleEN || null;
            this.titleBN = defaultData.titleBN || null;
            this.objectName = "Sections";
        }




    }]);