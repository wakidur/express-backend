(function () {
    'use strict';

    angular
        .module('Module')
        .factory('applicationDataService', constructor);

    constructor.$inject = ['$http', '$q', 'baseDataService'];

    function constructor($http, $q, baseDataService) {
        let apiServiceUrl = 'http://localhost:6661/api/';
        let serviceUrl = apiServiceUrl + 'applicationData/';
        let getApplicationUrl = serviceUrl + 'getApplication';
        var service = {
            getApplication: getApplication,
            postOrUpdateEntity: postOrUpdateEntity,
            deleteApp: deleteApp,
        };

        return service;

        // get application data from server
        function getApplication(tick) {
            try {
                return baseDataService.executeQuery(serviceUrl, {tick: tick});
            } catch (error) {
                throw error;
            }
            
        }
         // post application data from server
         function postOrUpdateEntity(entity) {
            try {
                return baseDataService.save(serviceUrl, entity);
            } catch (error) {
                throw error;
            }
            
        }
         // delete application data from server
         function deleteApp(entity) {
            try {
                return baseDataService.removeEntity(serviceUrl, entity);
            } catch (error) {
                throw error;
            }
            
        }
    }
})();