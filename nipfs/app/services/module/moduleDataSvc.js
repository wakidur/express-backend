var services = angular.module('app');

services.factory('moduleDataSvc', ['$http', 'baseDataSvc',
function ($http, baseSvc) {

    var serviceUrl = apiServiceUrl + 'moduleServicedata/';
    
    var getModuleUrl = serviceUrl + 'GetModuleServiceData';
    var getMianPageUrl = serviceUrl + 'GetMainPageData';  // check main page have used an another scope or not 
    var deleteMasterModuleUrl = serviceUrl + 'masterModule';  // delete master module 
    var deleteSectionUrl = serviceUrl + 'section';

    var dataSvc = {
        getModuleData: getModuleData,
        pageDelete: pageDelete,
        sectionDelete: sectionDelete,
        saveOrUpdateModuleData: saveOrUpdateModuleData,
        deleteMasterModule: deleteMasterModule,
        checkIsMainPage: checkIsMainPage

    // deletepageData: deletepageData
};
    // ReSharper disable once QualifiedExpressionIsNull
    return dataSvc;

    function getModuleData(tick) {
        try {
            return baseSvc.executeQuery(getModuleUrl, { tick: tick });
        } catch (e) {
            throw e;
        }
    }

    function pageDelete(entity) {
        try {
            return baseSvc.removeEntity(serviceUrl, entity);
        } catch (e) {
            throw e;
        }
    }

    function sectionDelete(entity) {
        try {
            return baseSvc.removeEntity(deleteSectionUrl, entity);
        } catch(e) {
            throw e;
        } 
    }

    function saveOrUpdateModuleData(entity) {
        try {
            return baseSvc.save(serviceUrl, entity);
        } catch (e) {
            throw e;
        }
    }

    // delete master module with its page list 
    function deleteMasterModule(entity) {
        try {
            return baseSvc.removeEntity(deleteMasterModuleUrl, entity);
        } catch(e) {
            throw e;
        } 
    }

    // check is page is used an another scope as main page 
    function checkIsMainPage(entity) {
        try {
            return baseSvc.save(getMianPageUrl, entity,true);
        } catch (e) {
            throw e;
        } 
    }

   
}]);