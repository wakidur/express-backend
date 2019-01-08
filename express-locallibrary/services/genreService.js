/*----------------- require Model -----------------*/
/*import  genreModel*/
let Genre = require('../models/genreModel');

/* import  bookModel */
let Book = require('../models/bookModel');

/*----------------- require q -----------------*/
let Q = require('q');

/*----------------- exports service-----------------*/
module.exports = {
    getGenreList: getGenreList,
    getGenreDetail: getGenreDetail,
    genreCreatePost: genreCreatePost,
    genreDeleteGet: genreDeleteGet,
    genreDeletePost: genreDeletePost,
    genreUpdateGet: genreUpdateGet,
    genreUpdatePost: genreUpdatePost,
};

// Get Genre List
function getGenreList() {
    let deferred = Q.defer();
    Genre.find()
        .sort([
            ['name', 'ascending']
        ])
        .then((genresList) => {
            deferred.resolve(genresList);
        }).catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

// Get Genre Detail
function getGenreDetail(reqId) {
    let deferred = Q.defer();
    let resutls = {};
    Q.all([
        Genre.findById(reqId),
        Book.find({
            'genre': reqId
        })
    ]).then((value) => {
        resutls.genre = value[0];
        resutls.genre_books = value[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;
}

// genre Create Post
function genreCreatePost(name) {
    let deferred = Q.defer();
    Genre.findOne({
            'name': name
        })
        .then((result) => {
            deferred.resolve(result);
        }).catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

// genre Delete Get
function genreDeleteGet(reqId) {
    let deferred = Q.defer();
    let resutls = {};
    Q.all([
        Genre.findById(reqId),
        Book.find({
            'genre': reqId
        })
    ]).then((value) => {
        resutls.genre = value[0];
        resutls.genre_books = value[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;
}

// genre Delete Post
function genreDeletePost(reqId) {
    let deferred = Q.defer();
    let resutls = {};
    Q.all([
        Genre.findById(reqId),
        Book.find({
            'genre': reqId
        })
    ]).then((value) => {
        resutls.genre = value[0];
        resutls.genre_books = value[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;
}

// genre Update Get
function genreUpdateGet(reqId) {
    let deferred = Q.defer();
    Genre.findById(reqId)
        .then((result) => {
            deferred.resolve(result);
        }).catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;

}

// genre Update Post
function genreUpdatePost(reqId, genre) {
    let deferred = Q.defer();
    Genre.findByIdAndUpdate(reqId, genre, {})
        .then((genre) => {
            deferred.reject(err);
        }).catch((err) => {
            deferred.resolve(genre);
        });
    return deferred.promise;

}