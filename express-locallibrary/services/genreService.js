/*import  genreModel*/
let Genre = require('../models/genreModel');

/* import  bookModel */
let Book = require('../models/bookModel');

/* Import validation and sanitisation methods */
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

/* Import async */
let async = require('async');

/* Q */
let Q = require('q');
/*
module.exports = {
    getGenreList: getGenreList,
    getGenreDetail: getGenreDetail,
    GenreCreatePost: GenreCreatePost,
    genreDeleteGet: genreDeleteGet,
    genreDeletePost: genreDeletePost,
    genreUpdateGet: genreUpdateGet,
    genreUpdatePost: genreUpdatePost,
}

function getCount() {
    var deferred = Q.defer();
    var resutls = {};
    Q.all([]).then((value) => {
        resutls.book_count = value[0];

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
        .exec(function(err, list_books) {
            if (err) {
                deferred.reject(err);
            }
            //sucessfull , 
            deferred.resolve(list_books);
        });
    return deferred.promise;
}

function getGenreList(params) {
    let deferred = Q.defer();
    Genre.find()
        .sort(['name', 'ascending'])
        .exec((err, genresList) => {
            if (err) {
                deferred.reject(err);
            } else {
                // Successful
                deferred.resolve(genresList);
            }
        });
    return deferred.promise;
}

// getGenreDetail
function getGenreDetail(reqId) {
    let deferred = Q.defer();
    let resutls = {};
    Q.all([
        Genre.findById(reqId),
        Book.find({ 'genre': reqId })
    ]).then((value) => {
        resutls.genre = value[0];
        resutls.genre_books = value[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });

    return deferred.promise;
}
*/