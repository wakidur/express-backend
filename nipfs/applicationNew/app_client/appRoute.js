(function(){
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

        routeConfig.$inject = ['$routeProvider'];

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app_client/views/applicationView.html',
                controller: 'applicationController',
                controllerAs : 'vm'
            });

    }

}());