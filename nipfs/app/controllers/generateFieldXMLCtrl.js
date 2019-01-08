var app = angular.module('app');

app.controller('generateFieldXMLCtrl', ['$scope', '$rootScope', 'fieldDataSvc', '$modalInstance',
    function ($scope, $rootScope, fieldDataSvc, $modalInstance) {

        var vm = $scope;

        // variable declaration
        vm.isEnglishXml = false;
        vm.modalHeader = null;  // show modal page header 
        //vm.isBangaliFieldExist = false;
        vm.fieldList = [];  // all field list 
        vm.fields = [];   // selected field to generate xml 
        vm.appModuleList = [];  // application wise module list 
        vm.appObj = {};  // application dropdown objecct 
        vm.moduleObj = {};  // module dropdown object 
        vm.appFiledList = [];
        // main object 
        vm.fieldObj = {};

        // method declaration 
        vm.createXML = createXML;
        vm.closeModal = closeModal;
        vm.getApp = getApp;
        //vm.getModule = getModule;


        var xmlPath = 'Z:/Work Share/DevelopmentShare/compositeknitwear/newXmlFiles/';

        // constructor 
        _init();


        function _init() {
            try {

                vm.appObj = {};  // application dropdown objecct 
                vm.moduleObj = {};  // module dropdown object 

                vm.fieldObj = new field();  // main object 

                vm.isEnglishXml = vm.$parent.EN;
                vm.appList = angular.copy(vm.$parent.applicationList);
                vm.moduleList = angular.copy(vm.$parent.allModuleList);  // all module list 
                vm.fieldList = angular.copy(vm.$parent.flatObjectArrayList);

                vm.fields.length = 0;  // field to generate xml 
                vm.appModuleList.length = 0;   // application wise module list 
                //vm.appFiledList.length = 0;

                if (vm.isEnglishXml) {
                    vm.modalHeader = modalHeader.createEnglishFields;
                } else {
                    vm.modalHeader = modalHeader.createBanglaFields;
                }


            } catch (e) {
                showErrorMsg(e);
            }
        }


        function getApp(entity) {
            try {

                // vm.isBangaliFieldExist = false;

                vm.appModuleList.length = 0;
                vm.moduleObj = {};

                vm.appModuleList = Enumerable.From(vm.moduleList).Where(function (x) {
                    return x.applicationId == entity._id;
                }).ToArray();

                vm.fieldObj = new field({ applicationId: entity._id, applicationName: entity.name, appShortName: entity.shortName });

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // create xml 
        function createXML() {
            try {

                //vm.fieldList  all field list 
                vm.fields.length = 0;





                vm.fields = Enumerable.From(vm.fieldList).Where(function (x) {
                    //return x.applicationId == vm.fieldObj.applicationId && x.moduleId == vm.fieldObj.moduleId;
                    return x.applicationId == vm.fieldObj.applicationId;
                }).OrderBy("$.refIndex").ThenBy("$.name").ToArray();
                if (vm.fields.length > 0) {
                    if (vm.isEnglishXml) { // generate english xml 
                        _generateENXML();
                    } else { // generate bangla xml 
                        _generateBNXML();
                    }

                    // close modal 
                    $modalInstance.close();

                } else {
                    fieldItemExistMsg();  // no  filed item under this application message 
                }


            } catch (e) {
                showErrorMsg(e);
            }
        }


        // generate english xml 
        function _generateENXML() {
            try {
                if (vm.fieldObj.applicationId) {

                    // create xml with all data 
                    //var obj = {};
                    //obj[vm.fields[0].objectName] = {};
                    //obj[vm.fields[0].objectName]["_xmlns:xs"] = "http://www.w3.org/2001/XMLSchema-instance";
                    //obj[vm.fields[0].objectName]["_xmlns:xsd"] = "http://www.w3.org/2001/XMLSchema";


                    // create english xml
                    var engXmlObj = {};
                    engXmlObj[vm.fields[0].objectName] = {};
                    engXmlObj[vm.fields[0].objectName]["_xmlns:xs"] = "http://www.w3.org/2001/XMLSchema-instance";
                    engXmlObj[vm.fields[0].objectName]["_xmlns:xsd"] = "http://www.w3.org/2001/XMLSchema";


                    // json mian object name come from server data 
                    var range = "";
                    for (var i = 0; i < vm.fields.length; i++) {
                        if (vm.fields[i].refIndex != range) {
                            range = vm.fields[i].refIndex;
                            // get propety by index 
                            var rangeObj = Enumerable.From(vm.rangeList).FirstOrDefault(null, function (x) {
                                return x.name == vm.fields[i].refIndex;
                            });
                            //obj.Fields[vm.fields[i].refIndex] = new alphabeticObj({ _Range: rangeObj.range });  // all attribute in xml 

                            engXmlObj.Fields[vm.fields[i].refIndex] = new alphabeticObj();  // only english attribute in xml 
                        }

                        //obj.Fields[vm.fields[i].refIndex].Name.push(_addNameProperty(vm.fields[i]));

                        engXmlObj.Fields[vm.fields[i].refIndex].Name.push(_addEnglishProperty(vm.fields[i]));
                    }


                    //var xmlList = [];

                    //// generate xml data 
                    //var x2jsAll = new X2JS();
                    //var xmlAll = x2jsAll.json2xml_str(obj);

                    // generate english xml 
                    var x2jsEng = new X2JS();
                    var engXml = x2jsEng.json2xml_str(engXmlObj);

                    //// all attribute 
                    //var xmlObjContentAll = {};
                    //xmlObjContentAll["xml"] = xmlAll;
                    //xmlList.push(xmlObjContentAll);

                    // english  attribute 
                    var xmlObjContentEng = {};
                    xmlObjContentEng["xml"] = engXml;
                    //xmlObjContentEng["applicationName"] = vm.fieldObj.applicationName;
                    xmlObjContentEng["applicationName"] = "FieldsTitle";

                    xmlObjContentEng["xmlSavePath"] = _getXMLSavePath();   // xml path comes from config.js file 

                    //xmlList.push(xmlObjContentEng);
                    //xmlList.push(vm.fieldObj);

                    //save English field  to client side 
                    var blob = new Blob([xmlObjContentEng.xml], {
                        type: "application/xhtml+xml;charset=charset=utf-8"
                    });

                    //save file
                    //saveAs(blob, "FieldsTitle" + ".xml");
                    saveAs(blob, xmlObjContentEng.applicationName + ".xml");


                    /*
                    // generate xml to server site 
                    fieldDataSvc.saveXMLData(xmlObjContentEng).then(function (data) {

                        //save English field  from client side 
                        var blob = new Blob([xmlObjContentEng.xml], {
                            type: "application/xhtml+xml;charset=charset=utf-8"
                        });

                        //save file
                        //saveAs(blob, "FieldsTitle" + ".xml");
                        saveAs(blob, vm.fieldObj.applicationName + ".xml");
                    });

                    */
                } else {
                    xmlGenerateMsg();
                }

            } catch (e) {
                showErrorMsg(e);
            }
        }

        // get xml save path
        function _getXMLSavePath() {
            try {

                switch (vm.fieldObj.appShortName) {
                    case appShortName.Acc:   // for style details 
                        return xmlSavePath.Acc;
                    case appShortName.KDCA:  //// for order details 
                        return xmlSavePath.KDCA;
                    default:
                        return null;
                }

            } catch (e) {
                showErrorMsg(e);
            }
        }



        // generate bangla xml 
        function _generateBNXML() {
            try {

                if (vm.fieldObj.applicationId) {

                    // create bangla xml 
                    var benXmlObj = {};
                    benXmlObj[vm.fields[0].objectName] = {};
                    benXmlObj[vm.fields[0].objectName]["_xmlns:xs"] = "http://www.w3.org/2001/XMLSchema-instance";
                    benXmlObj[vm.fields[0].objectName]["_xmlns:xsd"] = "http://www.w3.org/2001/XMLSchema";

                    // json mian object name come from server data 
                    var range = "";
                    for (var i = 0; i < vm.fields.length; i++) {
                        if (vm.fields[i].refIndex != range) {
                            range = vm.fields[i].refIndex;
                            // get propety by index 
                            var rangeObj = Enumerable.From(vm.rangeList).FirstOrDefault(null, function (x) {
                                return x.name == vm.fields[i].refIndex;
                            });
                            benXmlObj.Fields[vm.fields[i].refIndex] = new alphabeticObj({ _Range: rangeObj.range });  // only Bangla attribute in xml 
                        }

                        if (vm.fields[i].lBangla)
                            benXmlObj.Fields[vm.fields[i].refIndex].Name.push(_addBanglaProperty(vm.fields[i]));
                    }
                    // generate bangla  xml 
                    var x2jsBan = new X2JS();
                    var banXml = x2jsBan.json2xml_str(benXmlObj);

                    // all attribute 
                    var xmlObjContentBan = {};
                    xmlObjContentBan["xml"] = banXml;
                    //xmlObjContentBan["applicationName"] = vm.fieldObj.applicationName;
                    xmlObjContentBan["applicationName"] = "FieldsTitle";


                    // generate xml in client site 
                    var blob1 = new Blob([xmlObjContentBan.xml], {
                        type: "application/xhtml+xml;charset=charset=utf-8"
                    });

                    //save file
                    saveAs(blob1, "FieldsTitleBN" + ".xml");
                    //saveAs(blob1, vm.fieldObj.applicationName + 'BN' + ".xml");


                    /*
                    // save xml document from server 
                    fieldDataSvc.saveXMLDataBN(xmlObjContentBan).then(function (data) {

                        var blob1 = new Blob([xmlObjContentBan.xml], {
                            type: "application/xhtml+xml;charset=charset=utf-8"
                        });

                        //save file
                        saveAs(blob1, "FieldsTitleBN" + ".xml");
                        //saveAs(blob1, vm.fieldObj.applicationName + 'BN' + ".xml");
                    });

                    */
                } else {
                    xmlGenerateMsg();
                }

            } catch (e) {
                showErrorMsg();
            }
        }



        //// add property into Name list 
        //function _addNameProperty(entity) {
        //    try {
        //        var obj = new nameObj({
        //            _id: entity._id,
        //            //_Name: entity.name,
        //            _Value: entity.name, // 
        //            _Code: entity.code,
        //            _L: entity.l,
        //            _SH: entity.sh,
        //            _FH: entity.fh,
        //            _LBangla: entity.lBangla,
        //            _ShBangla: entity.shBangla,
        //            _FhBangla: entity.fhBangla,
        //            _Desc: entity.desc,
        //            _DescBangla: entity.descBangla,
        //            _MinLength: entity.minLength,
        //            _MaxLength: entity.maxLength,
        //            _Length: entity.length,
        //            _Values: entity.values,
        //            _DataType: entity.dataType,
        //            _Scale: entity.scale
        //        });
        //        return obj;
        //    } catch (e) {
        //        showErrorMsg(e);
        //    }
        //}

        // add property into Name list 
        function _addEnglishProperty(entity) {
            try {
                var obj = new engBanXmlObj({
                    _Value: entity.name,
                    _L: entity.l,
                    _SH: entity.sh,
                    _FH: entity.fh,
                    _Length: entity.length,
                    _Scale: entity.scale,
                    _DataType: entity.dataType,
                    _i18n: "E"
                });
                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // add property into Name list 
        function _addBanglaProperty(entity) {
            try {
                var obj = new engBanXmlObj({
                    //_Name: entity.name,
                    _Value: entity.name,
                    // _Code: entity.code,
                    _L: entity.lBangla,
                    _SH: entity.shBangla,
                    _FH: entity.fhBangla,
                });
                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // create alphabetic object property
        function alphabeticObj(defaultData) {
            defaultData = defaultData || {};
           // this._Range = defaultData._Range || null;
            this.Name = [];
        }

        //// Name object  property  for creating xml 
        //function nameObj(defaultData) {
        //    defaultData = defaultData || {};
        //    this._id = defaultData._id || null,
        //    //this._i18n = defaultData._i18n || null;
        //    // this._Name = defaultData._Name || null;  // VALUE 
        //    this._Value = defaultData._Value || null;
        //    this._Code = defaultData._Code || null;
        //    this._L = defaultData._L || null;
        //    this._SH = defaultData._SH || null;
        //    this._FH = defaultData._FH || null;
        //    this._LBangla = defaultData._LBangla || null;
        //    this._ShBangla = defaultData._ShBangla || null;
        //    this._FhBangla = defaultData._FhBangla || null;
        //    this._Desc = defaultData._Desc || null;
        //    this._DescBangla = defaultData._DescBangla || null;
        //    this._MinLength = defaultData._MinLength || null;
        //    this._MaxLength = defaultData._MaxLength || null;
        //    this._Length = defaultData._Length || null;
        //    this._Values = defaultData._Values || null;
        //    this._DataType = defaultData._DataType || null;
        //    this._Scale = defaultData._Scale || null;
        //}

        // xmlFix Object property 
        function engBanXmlObj(defaultData) {
            defaultData = defaultData || {};
            //this._Name = defaultData._Name || null;  // VALUE 
            this._Value = defaultData._Value || null;
            //this._Code = defaultData._Code || null;
            this._L = defaultData._L || null;
            this._SH = defaultData._SH || null;
            this._FH = defaultData._FH || null;
            this._Length = defaultData._Length || null;
            this._Scale = defaultData._Scale || null;
            this._DataType = defaultData._DataType || null;
            this._i18n = defaultData._i18n || null;
        }


        //  close modal
        function closeModal() {
            try {
                $modalInstance.close();
            } catch (e) {
                showErrorMsg();
            }
        }

        function field(defaultData) {
            defaultData = defaultData || {};
            this.applicationName = defaultData.applicationName || null;
            this.appShortName = defaultData.appShortName || null;
            this.applicationId = defaultData.applicationId || null;
            this.moduleId = defaultData.moduleId || null;
            this.moduleName = defaultData.moduleName || null;
        }


    }]);