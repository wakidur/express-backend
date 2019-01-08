/*** application Data Service *****/
var ApplicationModel = require('../../models/applicationModel');
var ModelContainer = require('../models/moduleServiceModel');
var ModuleModel = ModelContainer[2];
var FieldServiceModel = require('../models/fieldServiceModel');

/*----------------- require q -----------------*/
let Q = require('q');

/* Exports service */
module.exports = {
    getApplication,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
};

function getApplication() {
    let deferred = Q.defer();
    ApplicationModel
        .find()
        .sort({
            typeId: 1,
            alphabet: 1,
            code: 1
        }).then((data) => {
            deferred.resolve(data);
        }).catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}