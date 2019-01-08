var app = angular.module('app');

app.factory('fieldSpecsModelSvc', [function () {

    var confirmationList = [];
    var dataTypeList = [];
    var inputTypeList = [];
    var shortFullTypeList = [];

    var modelSvc = {
        getConfirmationList: getConfirmationList,
        getDataTypeList: getDataTypeList,
        getInputTypeList: getInputTypeList,
        getshortFullTypeList :getshortFullTypeList,
        checkDuplicateEntry: checkDuplicateEntry,   // check duplicate entry
        checkUpdateDuplicateEntry: checkUpdateDuplicateEntry,
};

    return modelSvc;

    function getConfirmationList() {
        try {
            confirmationList.length = 0;
            confirmationList.push(
                { value: true, name: 'Yes' },
                { value: false, name: 'No', });

            return confirmationList;
        } catch (e) {
            throw e;
        }

    }

    function getDataTypeList() {
        try {
            dataTypeList.length = 0;
            for (var data in dataType) {
                dataTypeList.push(dataType[data]);
            }
            return dataTypeList;
        } catch (e) {
            throw e;
        }
    }

    function getshortFullTypeList() {
        try {
            shortFullTypeList.length = 0;
            for (var data in shortFullType) {
                shortFullTypeList.push(shortFullType[data]);
            }
            return shortFullTypeList;
        } catch(e) {
            throw e;
        } 
    }

    function getInputTypeList() {
        try {
            inputTypeList.length = 0;

            for (var data in inputType) {
                inputTypeList.push(inputType[data]);
            }
            return inputTypeList;
        } catch (e) {
            throw e;
        }
    }

    
    function checkDuplicateEntry(entity , dataList) {
        try {
            var isChcek = false;
            
            var obj = Enumerable.From(dataList).FirstOrDefault(null, function (x) {
                return x.moduleId == entity.moduleId && x.mainPageId == entity.mainPageId && x.pageId == entity.pageId && x.sectionId == entity.sectionId && x.fieldId == entity.fieldId;
            });
            if (obj) {
                isChcek = true;
            }
            return isChcek;
        } catch(e) {
            throw e;
        } 
    }


    function checkUpdateDuplicateEntry(newVal, oldVal, dataList) {
        try {
            var isChcek = false;
            
            if (newVal.moduleId == oldVal.moduleId && newVal.mainPageId == oldVal.mainPageId && newVal.pageId == oldVal.pageId && newVal.sectionId == oldVal.sectionId && newVal.fieldId == oldVal.fieldId) 
                return isChcek;
            
            var obj = Enumerable.From(dataList).FirstOrDefault(null, function (x) {
                return x.moduleId == newVal.moduleId && x.mainPageId == newVal.mainPageId && x.pageId == newVal.pageId && x.sectionId == newVal.sectionId && x.fieldId == newVal.fieldId;
            });
            
            if (obj) {
                isChcek = true;
            }

            return isChcek;
        } catch(e) {
            throw e;
        } 
    }
}]);