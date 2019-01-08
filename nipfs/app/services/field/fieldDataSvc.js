
var services = angular.module('app');

services.factory('fieldDataSvc', ['$http', 'baseDataSvc',
function ($http, baseSvc) {

    var serviceUrl = apiServiceUrl + 'fieldServiceData/';
    var getAllFieldServiceUrl = serviceUrl + 'getAllFieldService';

    // save json data into mongodb
    var saveJsonDataUrl = serviceUrl + 'saveJsonData';

    // save all field title into database 
    var savelAllFieldServiceUrl = serviceUrl + 'saveAllFieldService';
    var saveUpdateCopiedAppFieldUrl = serviceUrl + 'copiedAppFieldService';
    // save xml 
    var saveXMLUrl = serviceUrl + 'saveXMLData';
    var saveXMLBNUrl = serviceUrl + 'saveXMLBNData';


    var dataSvc = {
        saveOrUpdateFieldService: saveOrUpdateFieldService, // save or update data 
        getAllFieldService: getAllFieldService,
        deleteFieldService: deleteFieldService,
        saveUpdateCopiedAppField : saveUpdateCopiedAppField,    // save or update application filed to other application 
        
        // save json data into mongodb
        saveJsonData: saveJsonData,
        //  save all field title data into server 
        saveAllFieldTitle: saveAllFieldTitle,
        
        // save xml data 
        saveXMLData: saveXMLData,  // english 
        saveXMLDataBN :saveXMLDataBN  // bengali 
};

    return dataSvc;

    // data service 

    // save json data into server 
    function saveJsonData(jsonData) {
        return baseSvc.save(saveJsonDataUrl, jsonData, true);
    }


    function saveOrUpdateFieldService(entity) {
        try {
            return baseSvc.save(serviceUrl, entity);
        } catch (e) {
            throw e;
        }
    }
    
    // save update one application field to other application
    function saveUpdateCopiedAppField(fieldList) {
        try {
            return baseSvc.save(saveUpdateCopiedAppFieldUrl, fieldList, true);
        } catch(e) {
            throw e;
        } 
    }

    function getAllFieldService(tick) {
        try {
            return baseSvc.executeQuery(getAllFieldServiceUrl, { tick: tick });
        } catch (e) {
            throw e;
        }
    }
    
    function deleteFieldService(entity) {
        try {
            return baseSvc.removeEntity(serviceUrl, entity);
        } catch (e) {
            throw e;
        }
    }


    // add all field title into database 
    function saveAllFieldTitle(fieldTitleList) {
        try {
            return baseSvc.save(savelAllFieldServiceUrl, fieldTitleList, true);
        } catch (e) {
            throw e;
        }
    }
    

    // save xml document into xml file by server 
    function saveXMLData(xml) {
        try {
            return baseSvc.save(saveXMLUrl, xml, true);
        } catch(e) {
            throw e;
        } 
    }
    

    // save bengali  xml document into xml file by server 
    function saveXMLDataBN(xml) {
        try {
            return baseSvc.save(saveXMLBNUrl, xml, true);
        } catch (e) {
            throw e;
        }
    }
}]);
