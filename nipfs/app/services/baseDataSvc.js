(function(){
    'use strict';

    angular
        .module('app')
        .service('baseDataSvc', constructor);

        constructor.$inject = ['$http', '$window', '$q'];

    function constructor($http, $window, $q) {
        
        this.executeQuery = executeQuery;
        this.save = save;
        this.remove = remove;
        this.remove = remove;
        this.removeEntity = removeEntity;

        function executeQuery(url, params, isPost) {
            try {
                var deferred = $q.defer();
                var config;
                if (isPost) {
                    config = {
                        url: url,
                        method: "POST",
                        data: params
                    };
                } else {
                    config = {
                        url: url,
                        method: "GET",
                        params: params
                    };
                }
                $http(config).then(function (results) {
                    deferred.resolve(results.data);
                }).catch(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;


            } catch (ex) {
                throw ex;
            }
        }

        function remove(url, entity, key, hasAction) {
            try {
                if (!hasAction) {
                    url = url + 'Delete';
                }

                return $http({
                    url: url,
                    method: "post",
                    params: { pk: (typeof key === "undefined" ? entity.id : entity[key]) }
                }).then(function (result) {
                    return result;
                }).catch(function (ex) {
                    ex.entity = entity;
                    throw ex;
                });
            } catch (ex) {
                throw ex;
            }
        }

        function removeEntity(url, entity) {
            try {
                return $http.post(url + 'Delete', entity).then(function (result) {
                    return result;
                }).catch(function (ex) {
                    throw ex;
                });

            } catch (ex) {
                throw ex;
            }
        }

        //To perform Server side insert/update/delete operation
        function save(url, data, hasAction) {
            if (!hasAction) {
                url = url + 'saveChanges';
            }
            return $http.post(url, data).then(function (results) {
                data = results.data;
                return data;
            }).catch(function (ex) {
                throw ex;
            });
        }
    }
})();