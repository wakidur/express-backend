
var services = angular.module('app');

services.factory('fieldValidationDataSvc', ['$http', 'baseDataSvc',
function ($http, baseSvc) {

    var serviceUrl = apiServiceUrl + 'fieldValidationServiceData/';
    var getFieldValidationUrl = serviceUrl + 'getFieldValidation';

    // save all field validation from xml  into database 
    var savelAllFieldValidationUrl = serviceUrl + 'saveAllFieldValidation';
    var copyAppValidationUrl = serviceUrl + 'copyAppValidation';

    var dataSvc = {
        // method declaration
        getFieldValidation: getFieldValidation,
        saveOrUpdate: saveOrUpdate,
        deleteEntity: deleteEntity,
        saveFieldValidations: saveFieldValidations,
        copyAppValidation: copyAppValidation

};

    return dataSvc;


    // method implementation 
    function getFieldValidation(tick) {
        try {
            return baseSvc.executeQuery(getFieldValidationUrl, { tick: tick });
        } catch (e) {
            throw e;
        } 
    }


    function saveOrUpdate(entity) {
        try {
            return baseSvc.save(serviceUrl, entity);
        } catch (e) {
            throw e;
        } 
    }

    // delete data from server
    function deleteEntity(entity) {
        try {
            return baseSvc.removeEntity(serviceUrl, entity);
        } catch (e) {
            throw e;
        }
    }

    function saveFieldValidations(fieldValidationList) {
        try {
            return baseSvc.save(savelAllFieldValidationUrl, fieldValidationList, true);
        } catch (e) {
            throw e;
        } 
    }


    // copy app validation one to another app 
    function copyAppValidation(fieldObj) {
        try {
            return baseSvc.save(copyAppValidationUrl, fieldObj, true);
        } catch (e) {
            throw e;
        }
    }


}]);
