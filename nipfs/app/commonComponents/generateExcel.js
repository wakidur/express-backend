/*
    Actor : Rasel Ahmed 
    Date :  30/08/2016  dd/MM/yyyy 
*/



/* ****************************************************  

data[i].isNewLine == ture ,   then generate new line in excel file  

N.B : header and data key property name must be same 
headerNames = {
                    fieldName: "Field Name",
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

data = [{
                    fieldName: "buyer",
                    fsName: "f",
                    inputType: "auto",
                    dataType: "Text",
                    minLength: 10,
                    maxLength: 10,
                    scale: 10,
                    isMandatory: true,
                    permissibleValue: "write something",
                    isEditable: true
                
                }]

 segregateData =  [{
                name : 'section 1'
                },
                name : 'section 2'
                }
            ];

N.B : if you want to segregate data then you shoud add extra proprty name  "isNewLine" into data object array list and this must be as last property in object 
      if you can declare segregate header then you can manage list as segregateData 

****************************************************  */



var directiveModule = angular.module('generateExcel', []);

directiveModule.directive('niGenerateExcel', ['$rootScope',

function ($rootScope) {

    return {
        scope: {
            data: '=',    // excel data 
            isSegregate: '@',   //  
            segregateData: '=',
            fileName: '=',    // file name 
            headerNames: '='
        },
        restrict: 'EAC', // Directive Scope is Element
        replace: true, // replace original markup with template 
        transclude: false,
        template: "<button type='button' class='btn btn-success' data-ng-click='downloadXLS()'><i class='fa fa-file-excel-o'></i>Generate Excel </button>",

        link: function (scope, element, attrs) {
            //export CSV

            function convertArrayOfObjectsToXML(args) {
                var result, ctr, keys, columnDelimiter, lineDelimiter, data;
                var headers = [];  // header name 

                data = args.data || null;
                if (data == null || !data.length) {
                    return null;
                }

                columnDelimiter = args.columnDelimiter || '\t';
                lineDelimiter = args.lineDelimiter || '\n';


                keys = Object.keys(scope.headerNames);

                for (key in scope.headerNames) {
                    if (scope.headerNames.hasOwnProperty(key)) {
                        headers.push(scope.headerNames[key]);

                    }
                }

                result = '';
                result += headers.join(columnDelimiter);
                result += lineDelimiter;

                var index = 0;  // used to segregartion 
                data.forEach(function (item) {
                    if (item.isNewLine) {
                        result += lineDelimiter;
                        if (scope.segregateData[index].name) {
                            result += columnDelimiter; result += scope.segregateData[index].name;
                            result += lineDelimiter;
                        }

                        index = index + 1;
                    }

                    ctr = 0;
                    keys.forEach(function (key) {
                        if (ctr > 0) result += columnDelimiter;

                        result += item[key];
                        ctr++;
                    });
                    result += lineDelimiter;
                });

                return result;
            }

            scope.downloadXLS = function () {
                var data, filename, link;

                var xlsData = convertArrayOfObjectsToXML({
                    data: scope.data
                });
                if (xlsData == null) return;

                filename = scope.fileName + ".xls";

                if (!xlsData.match(/^data:text\/xls/i)) {
                    xlsData = 'data:text/xls;charset=utf-8,' + xlsData;
                }
                data = encodeURI(xlsData);

                link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename);
                link.click();
            }
        }
    };
}]);