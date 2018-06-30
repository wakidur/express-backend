var app = angular.module('app');

app.controller('fieldSpecXlsCtr', ['$scope', '$rootScope', 'fieldSpecsDataSvc', '$modalInstance',
    function ($scope, rootScope, dataSvc, $modalInstance) {

        var vm = $scope;
        vm.modal = {
            fileName: ""
        };
        vm.flatObjectArrayList = [];

        // binding method 
        //vm.createXls = createXls;
        vm.closeModal = closeModal;

        vm.headerNames = {};  // header name property object 
        vm.exportData = [];  // field data 
        vm.sections = [];   // segregate excel with section 

        //constractor 
        init();

        function init() {
            try {

                vm.modal.fileName = vm.$parent.fieldSpecs.mainPageName;

                vm.flatObjectArrayList = angular.copy(vm.$parent.flatObjectArrayList);

                // generate data to create xls 
                _generateExcelData();



            } catch (e) {
                showErrorMsg();
            }
        }


        // generate xls file's data 
        function _generateExcelData() {
            try {

                // gerenate xecle file header name 
                _excelFileHeaderName();

                var tempData = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.applicationId === vm.$parent.fieldSpecs.applicationId
                        && x.moduleId === vm.$parent.fieldSpecs.moduleId && x.mainPageId === vm.$parent.fieldSpecs.mainPageId && x.pageId === vm.$parent.fieldSpecs.pageId;
                }).ToArray();

                var data = angular.copy(tempData);

                var emptySecIdData = [];
                emptySecIdData = Enumerable.From(data).Where(function (x) {
                    return x.sectionId === null;
                }).ToArray();

                emptySecIdData = Enumerable.From(emptySecIdData).Where(function (x) {
                    return x.sectionId = "0";
                }).ToArray();

                data = Enumerable.From(data).Where(function (x) {
                    return x;
                }).OrderBy("$.sectionId").ThenBy("$.name").ToArray();


                var sectionId = null;
                var isNewSection = false;
                for (var i = 0; i < data.length; i++) {

                    isNewSection = false;

                    if (i === 0) {
                        sectionId = data[i].sectionId;
                        vm.sections.push(new segregateDataObj({
                            name: data[i].sectionName
                        }));
                        //vm.sections.push(!data[i].sectionName ? 'null' : data[i].sectionName);
                        isNewSection = true;
                    }

                    if (sectionId !== data[i].sectionId) {

                        vm.sections.push(new segregateDataObj({
                            name: data[i].sectionName
                        }));

                        isNewSection = true;
                    }
                    sectionId = data[i].sectionId;

                    // excel record object property value 
                    var obj = new xlsDataObj({
                        fieldName: data[i].name,
                        fullHeader: data[i].fh,
                        shortHeader: data[i].sh,
                        fsName: data[i].shortFullTypeVal,
                        inputType: data[i].inputTypeName,
                        dataType: !data[i].dataType ? '' : data[i].dataType,
                        minLength: !data[i].minLength ? '' : data[i].minLength,
                        maxLength: !data[i].maxLength ? '' : data[i].maxLength,
                        scale: !data[i].scale ? '' : data[i].scale,
                        isMandatory: data[i].isMandatory ? 'y' : (data[i].isMandatory === null ? 'c' : 'n'),
                        permissibleValue: !data[i].permissibleValue ? '' : data[i].permissibleValue,
                        isEditable: data[i].isEditable ? 'y' : 'n',
                        isNewLine: isNewSection
                    });

                    vm.exportData.push(obj);


                }
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // generate header name 
        function _excelFileHeaderName() {
            try {

                vm.headerNames = {
                    fieldName: "Field Name",
                    fullHeader: "Full Header",
                    shortHeader: "Short Header",
                    fsName: "Short/Full Name",
                    inputType: "Input type",
                    dataType: "Data type",
                    minLength: "Min char",
                    maxLength: "Max char",
                    scale: "Scale [Number]",
                    isMandatory: "Mandatory",
                    permissibleValue: "Permissible Values",
                    isEditable: "Is Editable?"

                };


            } catch (e) {
                showErrorMsg(e);
            }
        }





        // create xls file 
        function createXls(vlsr, xlsName) {
            try {
                var xls = {};
                xls["xlsData"] = vm.flatObjectArrayList;
                xls["fileName"] = xlsName;

                dataSvc.createXls(xls).then(function (data) {

                    window.open('/app/excelFile/' + xls.fileName + '.xls', '_blank', 'toolbar=0,location=0,menubar=0');

                    $modalInstance.close();
                });
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



        function xlsDataObj(defaultData) {
            defaultData = defaultData || {};
            this.fieldName = defaultData.fieldName || null;
            this.fullHeader = defaultData.fullHeader || null;
            this.shortHeader = defaultData.shortHeader || null;
            this.fsName = defaultData.fsName || null;
            this.inputType = defaultData.inputType || '';
            this.dataType = defaultData.dataType || '';
            this.minLength = defaultData.minLength || '';
            this.maxLength = defaultData.maxLength || '';
            this.scale = defaultData.scale || '';
            this.isMandatory = defaultData.isMandatory || false;
            this.permissibleValue = defaultData.permissibleValue || '';
            this.isEditable = defaultData.isEditable || false;
            this.isNewLine = defaultData.isNewLine || false;

        }

        function segregateDataObj(defaultData) {
            defaultData = defaultData || {};
            this.name = defaultData.name || null;
        }


    }]);