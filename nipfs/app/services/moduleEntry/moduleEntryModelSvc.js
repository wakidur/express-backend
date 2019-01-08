var app = angular.module('app');
app.factory('moduleEntryModelSvc', [function () {
    var modelSvc = {

        checkDuplicateEntry: checkDuplicateEntry,

    };

    return modelSvc;

    function checkDuplicateEntry(list, entity, tempEntity) {
        try {
            var isExist = false;

            if (tempEntity._id) {
               if (entity.name.toLocaleLowerCase() == tempEntity.name.toLocaleLowerCase() && 
                entity.code.toLocaleLowerCase() == tempEntity.code.toLocaleLowerCase()) {
                   //isExist = false;
                   return isExist;
               }

               var duplicate = Enumerable.From(list).FirstOrDefault(null, function(x) {
                   return (x.name.toLowerCase() == entity.name.toLowerCase() || x.code.toLowerCase() == entity.code.toLowerCase())
                       && x.applicationId == entity.applicationId && x._id != entity._id;
               });

               if (duplicate)
                   isExist = true;

               return isExist;
            }

            // check duplicate when entity insert 
            var duplicate1 = Enumerable.From(list).FirstOrDefault(null, function (x) {
                return (x.name.toLowerCase() == entity.name.toLowerCase() || x.code.toLowerCase() == entity.code.toLowerCase())
                    && x.applicationId == entity.applicationId;
            });

            if (duplicate1)
                isExist = true;
            
        return isExist;

        } catch (e) {
            throw e;
        } 
    }


}]);