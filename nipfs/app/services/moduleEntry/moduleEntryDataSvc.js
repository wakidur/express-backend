var services = angular.module('app');

services.factory('moduleEntryDataSvc', ['$http', 'baseDataSvc',
function ($http, baseSvc) {

    var serviceUrl = apiServiceUrl + 'moduleEntrydata/';
    var getModuleUrl = serviceUrl + 'GetModuleData';  // get module


    var dataSvc = {
        // method binding 
        saveOrUpdateEntity: saveOrUpdateEntity,
        getModuleData: getModuleData,
        deleteModule: deleteModule,
};
    // ReSharper disable once QualifiedExpressionIsNull
    return dataSvc;

    // save or update module entry
    function saveOrUpdateEntity(entity) {
        try {
            return baseSvc.save(serviceUrl, entity);
        } catch (e) {
            throw e;
        } 
    }

    // get module data 
    function getModuleData(tick) {
        try {
            return baseSvc.executeQuery(getModuleUrl, { tick: tick });
        } catch (e) {
            throw e;
        } 
    }

    // delete module 
    function deleteModule(entity) {
        try {
            return baseSvc.removeEntity(serviceUrl, entity);
        } catch (e) {
            throw e;
        } 
    }

}]);