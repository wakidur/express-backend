(function() {
    'use strict';

    angular
        .module('app')
        .factory('applicationModelSvc', constructor);

        constructor.$inject = [];
    function constructor() {
        var service = {
            chcekdDuplicate: chcekdDuplicate,
        };
        
        return service;

        ////////////////
        function chcekdDuplicate(entity, list, tempObj) { 
            try {
                let isDuplicate = false;
                if (tempObj) {
                    if (entity.name.toLocaleLowerCase() === tempObj.name.toLocaleLowerCase() && entity.shortName.toLocaleLowerCase() === tempObj.shortName.toLocaleLowerCase()) {
                        return isDuplicate;
                        
                    }
                }
               var dupliateObjLodesh = _.filter(list, function(o) { 
                    return x.name.toLocaleLowerCase() === entity.name.toLocaleLowerCase() || x.shortName.toLocaleLowerCase() === entity.shortName.toLocaleLowerCase();; 
                });
                if (dupliateObjLodesh) {
                    isDuplicate = true;
                }

                return isDuplicate;
            } catch (error) {
                
            }
        }
    }
})();