var app = angular.module('app');

app.controller('populateFieldTitleCtrl', ['$scope', '$http', 'fieldDataSvc',
    function ($scope, $http, fieldDataSvc) {

        var vm = $scope;

        // json data 
        vm.jsonData = {};

        // binding method 
        vm.allFieldTitleList = [];  // all field title list A - Z 
        vm.fieldTitleList = [];   // grid field title list 

        // binding method
        vm.submitForm = submitForm;


        _int();

        // inisialization
        function _int() {
            try {
                return $http.get("app/xml/FieldsTitle.xml",   /// Garments.xml , HRM.xml , common.xml, admin.xml, admin.xml
                {
                    transformResponse: function (cnv) {
                        var x2js = new X2JS();
                        var aftCnv = x2js.xml_str2json(cnv);
                        return aftCnv;
                    }
                })
             .success(function (response) {
                 // json object to array data list 
                 for (var property in response.Fields) {
                     if (response.Fields.hasOwnProperty(property)) {
                         // create list from json object 
                         _arryListfromJsonObj(property, response.Fields[property]);
                     }
                 }


                 // prepare grid view to dispaly 
                 search(vm.allFieldTitleList);


             });
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // save data into server 
        function submitForm() {
            try {

                //var arrayObj = {};
                // arrayObj["allFieldTitleList"] = vm.allFieldTitleList;

                //  var listLength = vm.allFieldTitleList.length;

                fieldDataSvc.saveAllFieldTitle(vm.allFieldTitleList).then(function (data) {

                    showSuccessSaveMsg();
                });
            } catch (e) {
                showErrorMsg(e);
            }
        }


        // create array list from json object 
        function _arryListfromJsonObj(range, rangProperty) {
            try {
                if (!rangProperty.Name)
                    return;
                for (var i = 0; i < rangProperty.Name.length; i++) {
                    // add to list 
                    vm.allFieldTitleList.push(_addFieldTitle(range, rangProperty.Name[i]));
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare new object property
        function _addFieldTitle(letter, entity) {
            try {
                var obj = new fieldTitle({
                    range: letter,
                    //code: entity._Code,
                    //name: entity._Name,
                    name: entity._Value,
                    l: entity._L,
                    sh: entity._SH,
                    fh: entity._FH,
                    desc: entity._Desc == 'null' ? null : entity._Desc,

                    lBangla: entity._LBangla == 'null' ? null : entity._LBangla,
                    shBangla: entity._ShBangla == 'null' ? null : entity._ShBangla,
                    fhBangla: entity._FhBangla == 'null' ? null : entity._FhBangla,
                    descBangla: entity._DescBangla == 'null' ? null : entity._DescBangla,
                    minLength: entity._MinLength == 'null' ? null : entity._MinLength,
                    maxLength: entity._MaxLength == 'null' ? null : entity._MaxLength,
                    length: entity._Length == 'null' ? null : entity._Length,
                    values: entity._Values == 'null' ? null : entity._Values,
                    dataType: entity._DataType == 'null' ? null : entity._DataType,
                    scale: entity._Scale == 'null' ? null : entity._Scale,
                    applicationId: "56fb4c7197a4510c0b0f5d57" // published  ACC 
                    //moduleId: "573da0e865c7d3140c8e64eb",  //  garments module 
                    //moduleId: "573da11465c7d3140c8e64ed",  //  General setup module 
                    //moduleId: "573da0f865c7d3140c8e64ec",  //  HRM module 
                    //moduleId: "5741234a2151840819836aab",  // Admin module 

                // language: entity._i18n
            });
                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // pagination custom criteria
        vm.criteria = {
            page: 1,  // no. of page 
            pagesize: 20,   // showing data into one page 

        };

        // vm.paginationPageNo = vm.criteria.page;
        vm.paging = {
            total: 0,
            totalpages: 0,
            fromShowing: 0,
            toShowing: 0,
            pagingOptions: [],  // page size 
            tempPaginationOption: [20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800]  // temp page size 
        };

        // watch call when any critera property has changed
        var watchData = vm.$watch('criteria', function (newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                if (newValue.page <= vm.paging.totalpages) {
                    search(vm.allFieldTitleList);
                } else {
                    vm.criteria.page = 1;
                }
            }
        }, true);

        function search(flatObjectArrayList) {
            try {

                vm.paging.total = flatObjectArrayList.length;
                if (!vm.isPaginationOptionChange)
                    vm.criteria.pagesize = 20; // set default page size */

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
                vm.fieldTitleList.length = 0;
                _prepareGrid(data);
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare grid data list 
        function _prepareGrid(data) {
            try {
                for (var i = 0; i < data.length; i++) {
                    var rangeObj = Enumerable.From(vm.fieldTitleList).FirstOrDefault(null, function (x) {
                        return x.range == data[i].range;
                    });

                    if (!rangeObj) {
                        // master object 
                        var fieldObj = new range({
                            // add if not exist 
                            range: data[i].range
                        });
                        //  push data into master object 
                        fieldObj.fieldTitleList.push(_childData(data[i]));
                        vm.fieldTitleList.push(fieldObj); // push master list 

                    } else { // if data is exist into grid view list 
                        rangeObj.fieldTitleList.push(_childData(data[i]));
                    }
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // prepare new object property
        function _childData(entity) {
            try {
                var obj = new fieldTitle({
                    range: entity.range,
                    //code: entity.code,
                    name: entity.name,
                    l: entity.l,
                    sh: entity.sh,
                    fh: entity.fh,
                    desc: entity.desc,
                    objectName: entity.objectName,
                    lBangla: entity.lBangla,
                    shBangla: entity.shBangla,
                    fhBangla: entity.fhBangla,
                    descBangla: entity.descBangla,
                    minLength: entity.minLength,
                    maxLength: entity.maxLength,
                    length: entity.length,
                    values: entity.values,
                    dataType: entity.dataType,
                    scale: entity.scale,
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
        function range(defaultData) {
            defaultData = defaultData || {};
            this.range = defaultData.range || null;
            // this.range = defaultData.range || null;
            this.fieldTitleList = [];
        }

        function fieldTitle(defaultData) {
            defaultData = defaultData || {};

            this.range = defaultData.range || null;
            //this.code = defaultData.code || null;
            this.name = defaultData.name || null;  // value
            this.l = defaultData.l || null;
            this.sh = defaultData.sh || null;
            this.fh = defaultData.fh || null;
            this.desc = defaultData.desc || null;
            this.objectName = 'Fields';

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
            //this.moduleId = defaultData.moduleId || null;

        }

    }]);