var BookInstance = require('../models/bookinstanceModel');
var Q = require('q');

// var bookInstanceService = {};

// bookInstanceService.getBookinstanceList = getBookinstanceList;

module.exports = {
    getBookinstanceList: getBookinstanceList
};

function getBookinstanceList() {
    var deferred = Q.defer();
    BookInstance.find()
        .populate('book')
        .exec(function (err, list_bookinstances) {
            if (err) {
                deferred.reject(err);
            }
            //sucessfull , 
            deferred.resolve(list_bookinstances);
        });
    return deferred.promise;
}