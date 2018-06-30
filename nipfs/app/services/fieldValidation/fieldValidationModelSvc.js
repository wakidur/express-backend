var app = angular.module('app');

app.factory('fieldValidationModelSvc', [function () {

    var rangeList = [];

    var modelSvc = {
        getRangeList: getRangeList,
        capitaliseFirstLetter: capitaliseFirstLetter,
        checkDuplicateEntry: checkDuplicateEntry,
        checkUpdateDuplicateEntry: checkUpdateDuplicateEntry // check duplicate entry when data is in update mode 

    };

    return modelSvc;

    // method implementation 
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

    //  capitailse the first letter
    function capitaliseFirstLetter(string) {
        try {
            return string.charAt(0).toUpperCase() + string.slice(1);
        } catch (e) {
            showErrorMsg(e);
        }
    }

    // check duplicate data 
    function checkDuplicateEntry(entity, list) {
        try {
            var isChcek = false;

            var obj = Enumerable.From(list).FirstOrDefault(null, function (x) {
                return x.name.toLowerCase() === entity.name.toLowerCase();
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

            if (newVal.name.toLowerCase() === oldVal.name.toLowerCase())
                return isChcek;

            var obj = Enumerable.From(dataList).FirstOrDefault(null, function (x) {
                return x.name.toLowerCase() === newVal.name.toLowerCase();
            });

            if (obj) {
                isChcek = true;
            }
            return isChcek;
        } catch (e) {
            throw e;
        }
    }

}]);