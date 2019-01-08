(function () {
    'use strict';

    angular
        .module('app')
        .factory('applicationModelSvc', constructor);

    constructor.$inject = ['$http'];

    function constructor($http) {
        var modelSvc = {
            chcekdDuplicate: chcekdDuplicate // check duplicate data 
        };

        return modelSvc;

        // check duplicate data 
        function chcekdDuplicate(entity, list, tempObj) {
            try {
                var isDuplicate = false;

                if (tempObj) // For update application 
                    if (entity.name.toLocaleLowerCase() === tempObj.name.toLocaleLowerCase() && entity.shortName.toLocaleLowerCase() === tempObj.shortName.toLocaleLowerCase())
                        return isDuplicate;
                
                // var dupliateObj = Enumerable.From(list).FirstOrDefault(null, function (x) {
                //     return x.name.toLocaleLowerCase() === entity.name.toLocaleLowerCase() || x.shortName.toLocaleLowerCase() === entity.shortName.toLocaleLowerCase();
                // });

                // if (dupliateObj)
                //     isDuplicate = true;

                
                var dupliateObjLodesh = _.filter(list, function(o) { 
                    return o.name.toLocaleLowerCase() === entity.name.toLocaleLowerCase() || o.shortName.toLocaleLowerCase() === entity.shortName.toLocaleLowerCase();
                });
                if ( !(dupliateObjLodesh.length === 0) ) {
                    isDuplicate = true;
                }

                

                return isDuplicate;

            } catch (e) {
                throw e;
            }
        }
    }
})();

// var app = angular.module('app');

// app.factory('applicationModelSvc', [function () {

//     var modelSvc = {
//         // method declaration
//         chcekdDuplicate: chcekdDuplicate,   // check duplicate data 


//     };

//     return modelSvc;

//     // method implementation 

//     // check duplicate data 
//     function chcekdDuplicate(entity, list, tempObj) {
//         try {
//             var isDuplicate = false;

//             if (tempObj)  // For update application 
//                 if (entity.name.toLocaleLowerCase() === tempObj.name.toLocaleLowerCase() && entity.shortName.toLocaleLowerCase() === tempObj.shortName.toLocaleLowerCase())
//                     return isDuplicate;

//             var dupliateObj = Enumerable.From(list).FirstOrDefault(null, function (x) {
//                 return x.name.toLocaleLowerCase() === entity.name.toLocaleLowerCase() || x.shortName.toLocaleLowerCase() === entity.shortName.toLocaleLowerCase();
//             });

//             if (dupliateObj)
//                 isDuplicate = true;

//             return isDuplicate;

//         } catch (e) {
//             throw e;
//         }
//     }


// }]);