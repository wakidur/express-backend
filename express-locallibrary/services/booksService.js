/*bookModel*/
var Book = require('../models/bookModel');
/*authorModel*/
var Author = require('../models/authorModel');
/*genreModel*/
var Genre = require('../models/genreModel');
/*bookinstanceModel*/
var BookInstance = require('../models/bookinstanceModel');
/*ifconditionHelper*/
var ifcond = require('../helper/ifconditionHelper');
/*mongoose*/
var mongoose = require('mongoose');
/*async*/
var async = require('async');

var Q = require('q');

/*body validationResult */
const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

var booksService = {};

booksService.getCount = getCount;
booksService.getBookList = getBookList;

module.exports = booksService;


function getCount() {
    var deferred = Q.defer();
    var resutls = {};
    Q.all([
        Book.count({}),
        BookInstance.count({}),
        BookInstance.count({
            status: 'Available'
        }),
        Author.count({}),
        Genre.count({})
    ]).then((value) => {
        resutls.book_count = value[0];
        resutls.book_instance_count = value[1];
        resutls.book_instance_available_count = value[2];
        resutls.author_count = value[3];
        resutls.genre_count = value[4];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;
}


function getBookList() {
    var deferred = Q.defer();
    Book.find({}, 'title author')
        .populate('author')
        .exec(function (err, list_books) {
            if (err) {
                deferred.reject(err);
            }
            //sucessfull , 
            deferred.resolve(list_books);
        });
    return deferred.promise;
}

// function getCount(cb) {
//     async.parallel({
//         book_count: function (callback) {
//             Book.count({}, callback);
//             // Pass an empty object as match condition to find all documents of this collection
//         },
//         book_instance_count: function (callback) {
//             BookInstance.count({}, callback);
//         },
//         book_instance_available_count: function (callback) {
//             BookInstance.count({
//                 status: 'Available'
//             }, callback);
//         },
//         author_count: function (callback) {
//             Author.count({}, callback);
//         },
//         genre_count: function (callback) {
//             Genre.count({}, callback);
//         },
//     }, function (err, results) {
//         return cb(err, results);
//     });
// }