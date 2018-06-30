var app = angular.module('app');

app.factory('fieldModelSvc', [function () {

    var dataTypeList = [];
    var rangeList = [];

    this.a = [];

    var modelSvc = {
       // method binding 
        getRangeList: getRangeList,
        getDataTypeList: getDataTypeList,
        setFieldDetail: setFieldDetail,
        checkDuplicateEntry: checkDuplicateEntry,
        checkUpdateDuplicateEntry :checkUpdateDuplicateEntry,
    };

    return modelSvc;



    function getRangeList() {
        try {
            rangeList.length = 0;
            for (var data in rangeType) {
                rangeList.push(rangeType[data]);
            }
            return rangeList;
        } catch (e) {
            throw e;
        }
    }

    // get and push data type list 
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

    function setFieldDetail(entity, obj) {
        try {

            var fieldDetail = {};

            if (entity != null && obj != null) {
                fieldDetail.code = entity.code;
                fieldDetail.name = entity.name;
                fieldDetail.f = obj.f;
                fieldDetail.fh = obj.fh;
                fieldDetail.s = obj.s;
                fieldDetail.language = entity.language;
                // Bangla mapping
                fieldDetail.fBangla = entity.f;
                fieldDetail.fHBangla = entity.fh;
                fieldDetail.sBangla = entity.s;
            }

            return fieldDetail;
        } catch (e) {
            throw e;
        }
    }


    function checkDuplicateEntry(entity, list) {
        try {
            var isChcek = false;
            
            var obj = Enumerable.From(list).FirstOrDefault(null, function (x) {
                return x.name.toLowerCase() == entity.name.toLowerCase();
            });
            if (obj) {
                isChcek = true;
            }
            return isChcek;
        } catch (e) {
            throw e;
        }
    }
    

    // check duplicate to update 

    function checkUpdateDuplicateEntry(newVal, oldVal, dataList) {
        try {
            var isChcek = false;

            if (newVal.name.toLowerCase() == oldVal.name.toLowerCase())
                return isChcek;

            var obj = Enumerable.From(dataList).FirstOrDefault(null, function (x) {
                return x.name.toLowerCase() == newVal.name.toLowerCase();
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