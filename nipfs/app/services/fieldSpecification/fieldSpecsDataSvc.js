
var services = angular.module('app');

services.factory('fieldSpecsDataSvc', ['$http', 'baseDataSvc',
function ($http, baseSvc) {

    var serviceUrl = apiServiceUrl + 'fieldSpecsData/';

    var getAllFieldServiceUrl = serviceUrl + 'getAllFieldService';  // url to get all fields from field service 
    var getModuleUrl = serviceUrl + 'getAllModuleService';   // url to get module from module service Model
    var getFieldSpecsUrl = serviceUrl + 'getAllFieldSpecs';

    // save xml 
    var createXlsUrl = serviceUrl + 'createXls';

    var dataSvc = {
        getAllFieldService: getAllFieldService, // get all field service from database  
        getAllModuleService: getAllModuleService,  // get module from server 
        saveOrUpdateFieldService: saveOrUpdateFieldService,
        getAllFieldSpecs: getAllFieldSpecs,
        deleteFieldSpecs: deleteFieldSpecs,
        createXls: createXls,



    };

    return dataSvc;


    // get all field service 
    function getAllFieldService(tick) {
        try {
            return baseSvc.executeQuery(getAllFieldServiceUrl, { tick: tick });
        } catch (e) {
            throw e;
        }
    }

    // get all module service 
    function getAllModuleService(tick) {
        try {
            return baseSvc.executeQuery(getModuleUrl, { tick: tick });
        } catch (e) {
            throw e;
        }
    }


    // save or update data into server 
    function saveOrUpdateFieldService(entity) {
        try {
            return baseSvc.save(serviceUrl, entity);
        } catch (e) {
            throw e;
        }
    }

    // get all field specification from server 
    function getAllFieldSpecs(tick) {
        try {
            return baseSvc.executeQuery(getFieldSpecsUrl, { tick: tick });
        } catch (e) {
            throw e;
        }
    }


    // delete data from server 
    function deleteFieldSpecs(entity) {
        try {
            return baseSvc.removeEntity(serviceUrl, entity);
        } catch (e) {
            throw e;
        }
    }


    // create excel 

    function createXls(data) {
        try {
            return baseSvc.save(createXlsUrl, data, true);

        } catch (e) {
            throw e;
        }
    }


}]);
