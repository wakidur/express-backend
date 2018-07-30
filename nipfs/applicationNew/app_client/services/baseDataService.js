(function () {
    'use strict';

    angular
        .module('app')
        .service('baseDataService', constructor)

    constructor.$inject = ['$http', '$q'];

    function constructor($http, $q) {
        this.executeQueryta = executeQuery;
        this.remove = remove;
        this.removeEntity = removeEntity;
        this.save = save;


        // Execute Query
        function executeQuery(url, params, isPost) {
            try {
                let deferred = $q.defer();
                let config = {};
                if (isPost) {
                    config = {
                        url: url,
                        method: "POST",
                        data: params
                    }
                } else {
                    config = {
                        url: url,
                        method: "GET",
                        params: params
                    }
                }

                $http(config).then((results) => {
                    deferred.resolve(results.data);
                }).catch((error) => {
                    deferred.reject(error);
                });
                return deferred.promise;;
            } catch (error) {
                throw error;
            }
        }

        // Remove
        function remove(url, entity, key, hasAction) {
            try {
                let deferred = $q.defer();
                if (!hasAction) {
                    url = url + "Delete";
                }
                let config = {
                    url: url,
                    method: "POST",
                    params: {
                        pk: (typeof key === "undefined" ? entity.id : entity[key])
                    }
                }
                $http(config).then((results) => {
                    deferred.resolve(results.data);
                }).catch((error) => {
                    error.entity = entity;
                    deferred.reject(error);
                });
            } catch (error) {
                throw error;
            }

        }

        // Remove Entity
        function removeEntity(url, entity) {
            try {
                let deferred = $q.defer();
                let config = `${url}Delete`;
                $http.post(config, entity).then( (results)=> {
                    deferred.resolve(results.data);
                }).catch( (error) => {
                    deferred.reject(error);
                });
                return deferred.promise;
            } catch (error) {
                throw error;
            }

        }

        // Save data
        function save(url, data, hasAction) {
            try {
                if (!hasAction) {
                    url = `${url}saveChanges`;
                }
                var deferred = $q.defer();
                $http.post(url, data).then((results) => {
                    deferred.resolve(results.data);
                }).catch((error) => {
                    deferred.reject(error);
                });
                return deferred.promise;
            } catch (error) {
                throw error;
            }
        }
    }
})();