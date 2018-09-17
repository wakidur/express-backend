/*----------------- require Model -----------------*/
const mongoose = require('mongoose');
let Genre = require('../models/genreModel');

/*----------------- require q -----------------*/
let Q = require('q');

// Get Genre List
function getGenreList(req, res) {
    const {
        page,
        perPage
    } = req.query;
    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(perPage) || 10,
    };

    // Genre
    // .find({})
    // .skip((options.limit * options.page) - options.limit)
    // .limit(options.limit)
    // .exec(function(err, products) {
    //     Genre.count().exec(function(err, count) {
    //         if (err) return next(err)
    //         console.log(`${count} ${products}`);
    //     });
    // });



    let deferred = Q.defer();
    Genre.paginate({}, options).then((result) => {
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
// Genre Create Post
function genreCreatePost(name) {
    let deferred = Q.defer();
    Genre
        .findOne({'name': name})
        .then((result) => {
            deferred.resolve(result);
        }).catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

// Genre Delete Get
function genreDeleteGet(reqId) {
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

// Genre Delete Post
function genreDeletePost(reqId) {
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

// Genre object delete 
function genreDeleteById(id) {
    try {
        let deferred = Q.defer();
        Genre.findByIdAndRemove(id).then((result) => {
            let success = "Success Delete property";
            deferred.resolve(success);
            
        }).catch((err) => {
            deferred.reject(err);
        });
        return deferred.promise;
    } catch (error) {
        throw error;
    }
}

// Genre update Get 
function genreUpdateGet(reqId) {
    let deferred = Q.defer();
    Genre.findById(reqId).then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}


// Genre Update post 
function genreUpdatePost(reqId, genre) {
    let deferred = Q.defer();
    Genre.findByIdAndUpdate(reqId, genre).then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}


module.exports = {
    getGenreList,
    genreCreatePost,
    getGenreDetail,
    genreDeleteGet,
    genreDeletePost,
    genreDeleteById,
    genreUpdateGet,
    genreUpdatePost
}