/*----------------- require Model -----------------*/
const mongoose = require('mongoose');
let Genre = require('../models/genreModel');

/*----------------- require q -----------------*/
let Q = require('q');

// get genre list 
function getGenreList(req, res) {
    const {
        page,
        perPage
    } = req.query;
    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(perPage) || 5,
    };

    let deferred = Q.defer();
    Genre.paginate({}, options).then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;

}

// genre Create Post
function genreCreatePost(name) {
    let deferred = Q.defer();
    Genre
        .findOne({
            'name': name
        })
        .then((result) => {
            deferred.resolve(result);
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
    ]).then((value) => {
        resutls.genre = value[0];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;
}

module.exports = {
    getGenreList,
    genreCreatePost,
    getGenreDetail
}