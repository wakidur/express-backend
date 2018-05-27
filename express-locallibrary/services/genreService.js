/*import  genreModel*/
let Genre = require('../models/genreModel');

/* import  bookModel */
let Book = require('../models/bookModel');

/* Import validation and sanitisation methods */
const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

/* Import async */
let async = require('async');

/* Q */
let Q = require('q');
/*
    getGenreDetail: getGenreDetail,
    GenreCreatePost: GenreCreatePost,
    genreDeleteGet: genreDeleteGet,
    genreDeletePost: genreDeletePost,
    genreUpdateGet: genreUpdateGet,
    genreUpdatePost: genreUpdatePost,
}
*/
module.exports = {
    getGenreList: getGenreList,
    getGenreDetail: getGenreDetail,
    genreCreatePost: genreCreatePost,
    genreDeleteGet: genreDeleteGet,
    genreDeletePost: genreDeletePost,
    genreUpdateGet: genreUpdateGet,
    genreUpdatePost: genreUpdatePost,
};

function getGenreList() {
    let deferred = Q.defer();
    Genre.find()
        .sort([
            ['name', 'ascending']
        ])
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

function genreCreatePost(name) {
    Genre.findOne({
            'name': name
        })
        .exec(function(err, found_genre) {
            if (err) {
                deferred.reject(err);
            } else {
                //sucessfull , 
                deferred.resolve(found_genre);
            }
        });
    return deferred.promise;

}

function genreDeleteGet(reqId) {
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

function genreDeletePost(reqId) {
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

function genreUpdateGet(reqId) {

    let deferred = Q.defer();
    Genre.findById(reqId)
        .exec((err, genre) => {
            if (err) {
                deferred.reject(err);
            } else {
                // Successful
                deferred.resolve(genresList);
            }
        });
    return deferred.promise;

}

function genreUpdatePost(reqId) {
    let deferred = Q.defer();
    Genre.findByIdAndUpdate(reqId, genre, {})
        .exec((err, genre) => {
            if (err) {
                deferred.reject(err);
            } else {
                // Successful
                deferred.resolve(genresList);
            }
        });
    return deferred.promise;

}