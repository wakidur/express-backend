﻿var app = angular.module('app');

app.controller('modalFieldValidationCtrl', ['$scope', '$rootScope', 'fieldValidationDataSvc', '$modalInstance',
    function ($scope, rootScope, dataSvc, $modalInstance) {

        var vm = $scope;

        // binding variable 
        vm.margeAppField = {};
        vm.isPaginationOptionChange = false;
        vm.fieldList = []; // grid data list 
        vm.flatObjectArrayList = [];

        // binding method 

        vm.checkUncheckIndex = checkUncheckIndex;
        vm.checkUncheckField = checkUncheckField;
        vm.closeModal = closeModal;
        vm.submitData = submitData;

        //constractor 
        init();

        //Initial function
        function init() {
            try {
                vm.margeAppField = {};
                vm.isPaginationOptionChange = false;  // pagination range option  change  

                if (vm.$parent.cloneAppFieldObj) {
                    vm.margeAppField = angular.copy(vm.$parent.cloneAppFieldObj);
                }

                // get all field grid data 
                _getAllValidations();

            } catch (e) {
                showErrorMsg(e);  // show error message 
            }
        }


        function _getAllValidations() {
            try {
                var tick = (new Date()).getTime().toString();

                dataSvc.getFieldValidation(tick).then(function (result) {
                    // get flat object array list 

                    var allValidation = angular.copy(result);

                    vm.flatObjectArrayList.length = 0;
                    vm.flatObjectArrayList = Enumerable.From(allValidation).Where(function (x) {
                        return x.applicationId == vm.margeAppField.fromApplicationId;
                    }).ToArray();

                    for (var i = 0; i < vm.flatObjectArrayList.length; i++) {
                        vm.flatObjectArrayList[i]["isActive"] = false;
                    }

                    // prepare gird view and pagination
                    search(vm.flatObjectArrayList);
                });

            } catch (e) {
                showErrorMsg(e);
            }
        }

        //  close modal
        function closeModal() {
            try {
                vm.margeAppField = {};
                $modalInstance.close();
            } catch (e) {
                showErrorMsg();
            }
        }


        // data insert and update into server 
        function submitData() {
            try {
                var fieldList = Enumerable.From(angular.copy(vm.flatObjectArrayList)).Where(function (x) {
                    return x.isActive === true;
                }).ToArray();

                if (fieldList) {
                    // assaign new applicatiion id 
                    fieldList = Enumerable.From(fieldList).Where(function (x) {
                        return x.applicationId = vm.$parent.cloneAppFieldObj.toApplicationId;
                    }).ToArray();

                    var fieldObj = {};
                    fieldObj["fieldList"] = [];
                    fieldObj.fieldList = fieldList;

                    if (fieldObj.fieldList.length === 0) {
                        // show messagee
                        requiredItemMsg();
                    } else {
                        dataSvc.copyAppValidation(fieldObj).then(function (result) {
                            // close modal 
                            $modalInstance.close();

                            // copied success message 
                            itemCopiedMsg();
                            // reload field service data 
                            rootScope.$broadcast('reloadFeildValidationData', {
                                data: result.data
                            });

                        });
                    }
                    vm.margeAppField = {};
                } 
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
                    var appAlphabetObj = Enumerable.From(vm.fieldList).FirstOrDefault(null, function (x) {
                        return x.alphabet == data[i].alphabet;
                    });
                    if (!appAlphabetObj) {
                        // master object 
                        var fieldObj = new alphabetObj({
                            alphabet: data[i].alphabet
                        });

                        //  push data into master object 
                        fieldObj.fieldDetails.push(_pushChildList(data[i]));
                        vm.fieldList.push(fieldObj); // push master list 

                    } else { // if data is exist into grid view list 
                        appAlphabetObj.fieldDetails.push(_pushChildList(data[i]));
                    }
                }

                // check uncheck alphabetic range 
                for (var j = 0; j < vm.fieldList.length; j++) {
                    var fiedWithOutCheck = Enumerable.From(vm.flatObjectArrayList).FirstOrDefault(null, function (x) {
                        return x.isActive == false && x.alphabet == vm.fieldList[j].alphabet;
                    });

                    if (fiedWithOutCheck)
                        vm.fieldList[j].isActive = false;
                    else
                        vm.fieldList[j].isActive = true;

                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // push child list into parent object list 
        function _pushChildList(entity) {
            try {
                var obj = new fieldValidationObj({
                    _id: entity._id,
                    alphabet: entity.alphabet,
                    name: entity.name,
                    message: entity.message,
                    applicationId: entity.applicationId,
                    isActive: entity.isActive ? entity.isActive : false
                });
                return obj;
            } catch (e) {
                showErrorMsg(e);
            }
        }

        function checkUncheckIndex(isCheck, entity) {
            try {
                var fields = Enumerable.From(vm.flatObjectArrayList).Where(function (x) {
                    return x.alphabet === entity.alphabet;
                }).ToArray();

                // check uncheck main data list 
                for (var i = 0; i < fields.length; i++) {
                    fields[i].isActive = isCheck;
                }

                // check uncheck grid data 
                for (var j = 0; j < entity.fieldDetails.length; j++) {
                    entity.fieldDetails[j].isActive = isCheck;
                }
            } catch (e) {
                showErrorMsg(e);
            } 
        }

        // check uncheck specific field data 
        function checkUncheckField(isCheck, entity, masterEntity) {
            try {
               
                var field = Enumerable.From(vm.flatObjectArrayList).FirstOrDefault(null, function (x) {
                    return x._id == entity._id;
                });

                if (field)
                    !field.isActive ? (field["isActive"] = isCheck) : (field.isActive = isCheck);

                // chcekc uncheck field 
                var isActiveAllField = Enumerable.From(vm.flatObjectArrayList).FirstOrDefault(null, function (x) {
                    return x.isActive == false && x.alphabet == masterEntity.alphabet;
                });

                if (isActiveAllField) {
                    if (masterEntity.isActive) {
                        masterEntity.isActive = false;
                    }
                } else {
                    masterEntity.isActive = true;
                }
            } catch (e) {
                showErrorMsg(e);
            }
        }

        // **************************************  pagination *******************************************  


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


        function search(flatObjectArrayList) {
            try {

                // order by reflex index and name 
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
        function alphabetObj(defaultData) {
            defaultData = defaultData || {};
            this.alphabet = defaultData.alphabet || null;
            this.fieldDetails = [];
            this.isActive = defaultData.isActive || false;
        }

        // object defination 
        function fieldValidationObj(defaultData) {
            defaultData = defaultData || {};
            this._id = defaultData._id || null;
            this.alphabet = defaultData.alphabet || null;
            this.name = defaultData.name || null;
            this.message = defaultData.message || null;
            this.applicationId = defaultData.applicationId || null;
            this.isActive = defaultData.isActive || false;
        }


    }]);