
var app = angular.module('app');

// configure our routes
app.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'app/views/application.html',
            controller: 'applicationCtrl'
        })
        // route for the about page
        .when('/fieldService', {
            templateUrl: 'app/views/fieldService.html',
            controller: 'fieldServiceCtrl'
        })
        //route for the module entry
        .when('/moduleEntry', {
            templateUrl: 'app/views/moduleEntry.html',
            controller: 'moduleEntryCtrl'
        })
        //route for the page section entry
        .when('/pageSectionEntry', {
            templateUrl: 'app/views/moduleService.html',
            controller: 'moduleServiceCtrl'
        })
        // route for the field specification page 
        .when('/fieldSpecification', {
            templateUrl: 'app/views/fieldSpecification.html',
            controller: 'fieldSpecsCtrl'
        })
        .when('/fieldTitle', {
            templateUrl: 'app/views/fieldTitleGridView.html',
            controller: 'populateFieldTitleCtrl'
        })
        /* when('/pageExtra', {
            templateUrl: 'app/views/pageExtra.html',
            controller: 'pageExtraCtrl'
        }).*/
        .when('/pageSection', {
            templateUrl: 'app/views/pageSection.html',
            controller: 'pageSectionCtrl'
        })
        .when('/applicationService', {
            //route for the application page
            templateUrl: 'app/views/application.html',
            controller: 'applicationCtrl'
        })
        .when('/fieldValidation', {
            //route for the field validation page
            templateUrl: 'app/views/fieldValidation.html',
            controller: 'fieldValidationCtrl'
        });

});

