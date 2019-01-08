/*----------------- require Model -----------------*/
var user = require('../models/User');
/*----------------- require q -----------------*/
var Q = require('q');

// get Bookinstance List
function getUserAllRole() {
    let deferred = Q.defer();
    user.find().then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

module.exports = {
    getUserAllRole
}