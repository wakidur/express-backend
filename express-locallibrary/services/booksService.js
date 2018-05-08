/*bookModel*/
var Book = require('../models/bookModel');
/*authorModel*/
var Author = require('../models/authorModel');
/*genreModel*/
var Genre = require('../models/genreModel');
/*bookinstanceModel*/
var BookInstance = require('../models/bookinstanceModel');
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

/*
var booksService = {};

booksService.getCount = getCount;
booksService.getBookList = getBookList;
booksService.getBookDetail = getBookDetail;

module.exports = booksService;
 */
module.exports = {
    getCount: getCount,
    getBookList: getBookList,
    getBookDetail: getBookDetail,
    bookCreateGet: bookCreateGet,
    bookCreatePost: bookCreatePost

}

// Get Count value 

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

// Get Book List

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

// Get Book Detail

function getBookDetail(id) {
    let deferred = Q.defer();
    let resutls = {};
    Q.all([Book.findById(id).populate('author').populate('genre'), BookInstance.find({ 'book': id })]).then((value) => {
        resutls.book = value[0];
        resutls.book_instance = value[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;

}


// Book create form on GET

function bookCreateGet() {
    let deferred = Q.defer();
    let resutls = {};
    Q.all([
        Author.find(),
        Genre.find()
        ]).then((value) => {
        resutls.authors = value[0];
        resutls.genres = value[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;
     
}

// book create on POST
function bookCreatePost() {
    let deferred = Q.defer();
    let resutls = {};
    Q.all([
        Author.find(),
        Genre.find()
        ]).then((value) => {
        resutls.authors = value[0];
        resutls.genres = value[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;
     
}




