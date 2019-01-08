
var services = angular.module('app');

services.factory('commonDataSvc', ['$http', 'baseDataSvc',
function ($http, baseSvc) {

    var serviceUrl = apiServiceUrl + 'commonServiceData/';
    var getAppUrl = serviceUrl + 'GetAppData';  // get application data 
    var getModuleUrl = serviceUrl + 'GetModuleData';  // get module data 


    var dataSvc = {

        getAppData: getAppData, //get application list 
        getModuleData: getModuleData, // get module data 

};

    return dataSvc;

    // data service 

    function getAppData(tick) {
        try {
            return baseSvc.executeQuery(getAppUrl, { tick: tick });
        } catch (e) {
            throw e;
        }
    }

    function getModuleData(tick) {
        try {
            return baseSvc.executeQuery(getModuleUrl, { tick: tick });
        } catch (e) {
            throw e;
        } 
    }


}]);
