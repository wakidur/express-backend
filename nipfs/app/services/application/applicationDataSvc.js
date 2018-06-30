
var services = angular.module('app');

services.factory('applicationDataSvc', ['$http', 'baseDataSvc',
function ($http, baseSvc) {

    var serviceUrl = apiServiceUrl + 'applicationData/';
    var getApplicationUrl = serviceUrl + 'getApplication';


    var dataSvc = {
        // method declaration
        saveOrUpdateEntity: saveOrUpdateEntity,   // save or update data 
        getApplication: getApplication, // get data from server 
        deleteApp: deleteApp,   // delete data from server 
    };

    return dataSvc;


    // method implementation 

    function saveOrUpdateEntity(entity) {
        try {
            return baseSvc.save(serviceUrl, entity);
        } catch (e) {
            throw e;
        }
    }

    // get application data from server 
    function getApplication(tick) {
        try {
            return baseSvc.executeQuery(getApplicationUrl, { tick: tick });
        } catch (e) {

        }
    }
    
    // delete data from server
    function deleteApp(entity) {
        try {
            return baseSvc.removeEntity(serviceUrl, entity);
        } catch(e) {
            throw e;
        } 
    }

}]);
