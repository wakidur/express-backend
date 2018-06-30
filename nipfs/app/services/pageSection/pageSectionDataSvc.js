
var services = angular.module('app');

services.factory('pageSectionDataSvc', ['$http', 'baseDataSvc',
function ($http, baseSvc) {

     var serviceUrl = apiServiceUrl + 'pageSectionData/';
     var getAllPageSectionUrl = serviceUrl + 'getAllPageSection';

    // save xml 
     var saveXMLUrl = serviceUrl + 'saveXMLData';

    var dataSvc = {
        saveOrUpdateEntity: saveOrUpdateEntity,
        getPageSectionList: getPageSectionList,
        deleteSection: deleteSection,
        
        // save xml data 
        saveXMLData: saveXMLData,
};

    return dataSvc;

   // method implementation
    function saveOrUpdateEntity(entity) {
        try {
            return baseSvc.save(serviceUrl, entity);
        } catch(e) {
            throw e;
        } 
    }
    
    // get server data list 
    function getPageSectionList(tick) {
        try {
            return baseSvc.executeQuery(getAllPageSectionUrl, { tick: tick });
        } catch(e) {
            throw e;
        } 
    }
    
    // delete page section 
    function deleteSection(entity) {
        try {
            return baseSvc.removeEntity(serviceUrl, entity);
        } catch(e) {
            throw e;
        } 
    }

    // save  xml file  data 
    function saveXMLData(xml) {
        try {
            return baseSvc.save(saveXMLUrl, xml, true);
        } catch (e) {
            throw e;
        }
    }

}]);
