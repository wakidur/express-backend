var app = angular.module('app');

app.factory('pageSectionModelSvc', [function () {

    // variable binding 
    var rangeList = [];
    var pageTypeList = [];

    var modelSvc = {

        getRangeList: getRangeList,
        getPageTypList:getPageTypList,
        checkDuplicateEntry: checkDuplicateEntry,  // check duplicate data to save 
        checkUpdateDuplicateEntry: checkUpdateDuplicateEntry,  // check duplicate data to update   
    };

    return modelSvc;

    // method implimentation
    function getRangeList() {
        try {
            rangeList.length = 0;
            for (var data in rangeType) {
                rangeList.push(rangeType[data]);
            }
            return rangeList;
        } catch(e) {
            throw e;
        } 
    }
    
    // page type list 
    function getPageTypList() {
        try {
            pageTypeList.length = 0;
            for (var data in pageType) {
                pageTypeList.push(pageType[data]);
            }
            return pageTypeList;
        } catch (e) {
            throw e;
        }
    }
   
    // check duplicate data 
    function checkDuplicateEntry(entity, dataList) {
        try {
            var isChcek = false;

            var obj = Enumerable.From(dataList).FirstOrDefault(null, function (x) {
                return x.name.toLowerCase() == entity.name.toLowerCase();
            });
            if (obj) {
                isChcek = true;
            }
            return isChcek;
        } catch(e) {
            throw e;
        } 
    }


    // check duplicate data to update 
    function checkUpdateDuplicateEntry(newVal, oldVal, dataList) {
        try {
            var isChcek = false;

            if (newVal.name.toLowerCase() == oldVal.name.toLowerCase() )
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