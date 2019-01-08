var app = angular.module('app');

app.controller('generateFieldValidationXMLCtrl', ['$scope', '$rootScope', 'fieldValidationDataSvc', '$modalInstance', '$http',
function ($scope, $rootScope, dataSvc, $modalInstance, $http) {

    var vm = $scope;


    // binding variable 
    vm.appObj = {};  // application dropdown objecct 
    vm.fieldObj = {};  // main object 
    var applicationId = null;
    vm.fields = [];  // application wise field
    var fieldValidationList = [];

    // binding method 
    vm.createXML = createXML;
    vm.closeModal = closeModal;
    vm.getApp = getApp;

    // constructor 
    _init();


    function _init() {
        try {
            // modal page header  
            vm.modalHeader = modalHeader.createFieldsValidation;

            vm.appObj = {};  // application dropdown objecct 
            applicationId = null;
            vm.fields.length = 0;
            fieldValidationList.length = 0;

            vm.appList = angular.copy(vm.$parent.applicationList); // application list 
            fieldValidationList = angular.copy(vm.$parent.allFieldValidationData);  // 

        } catch (e) {
            showErrorMsg(e);
        }
    }


    function getApp(entity) {
        try {

            applicationId = entity._id;
        } catch (e) {
            showErrorMsg(e);
        }
    }

    function createXML() {
        try {

            vm.fields.length = 0;

            vm.fields = Enumerable.From(fieldValidationList).Where(function (x) {
                return x.applicationId === applicationId;
            }).OrderBy("$.alphabet").ThenBy("$.name").ToArray();

            if (vm.fields.length === 0) {
                fieldItemExistMsg();  // no  filed item under this application message 
                return;
            }


            vm.fields[0]["objectName"] = "ValidationMessages";

            var xmlObj = {};
            xmlObj[vm.fields[0].objectName] = {};
            xmlObj[vm.fields[0].objectName]["_xmlns:xsi"] = "http://www.w3.org/2001/XMLSchema-instance";
            xmlObj[vm.fields[0].objectName]["_xmlns:xsd"] = "http://www.w3.org/2001/XMLSchema";

            // json mian object name come from server data 
            var alphabet = "";
            for (var i = 0; i < vm.fields.length; i++) {
                if (vm.fields[i].alphabet !== alphabet) {
                    alphabet = vm.fields[i].alphabet;
                    // get propety by index

                    xmlObj.ValidationMessages[vm.fields[i].alphabet] = new alphabeticObj();  // only english attribute in xml 
                }

                xmlObj.ValidationMessages[vm.fields[i].alphabet].ValidationMessage.push(_getFieldValidation(vm.fields[i]));
            }

            // generate english xml 
            var x2jsEng = new X2JS();
            var engXml = x2jsEng.json2xml_str(xmlObj);

            // english  attribute 
            var xmlObjContent = {};
            xmlObjContent["xml"] = engXml;
            xmlObjContent["applicationName"] = "ValidationMessage";

            //save English field  to client side 
            var blob = new Blob([xmlObjContent.xml], {
                type: "application/xhtml+xml;charset=charset=utf-8"
            });

            //save file
            saveAs(blob, xmlObjContent.applicationName + ".xml");

            // close modal 
            $modalInstance.close();

        } catch (e) {
            showErrorMsg(e);
        }
    }

    function _getFieldValidation(entity) {
        try {
            var obj = new fieldValidatioObj({
                _Description: entity.message,
                _Value: entity.name
            });
            return obj;
        } catch (e) {
            showErrorMsg(e);
        }
    }

    //  close modal
    function closeModal() {
        try {
            $modalInstance.close();
        } catch (e) {
            showErrorMsg();
        }
    }

    // Object declaration for xml 
    function alphabeticObj(defaultData) {
        defaultData = defaultData || {};
        this.ValidationMessage = [];
    }

    // Name object  property  for creating xml 
    function fieldValidatioObj(defaultData) {
        defaultData = defaultData || {};

        this._Description = defaultData._Description || null;
        this._Value = defaultData._Value || null;

    }





}]);