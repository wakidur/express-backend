/*authorModel*/
var Author = require('../models/authorModel');
/*bookModel*/
var Book = require('../models/bookModel');
/* Q */
let Q = require('q');
/*body,validationResult */
const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

module.exports = {
    getAuthorList: getAuthorList,
    getAuthorDetail: getAuthorDetail,
    AuthorDeleteGet: AuthorDeleteGet,
    AuthorDeletePost: AuthorDeletePost,
    AuthorUpdateGet: AuthorUpdateGet,
    AuthorUpdatePost: AuthorUpdatePost
    // getAuthorDetail: getAuthorDetail,
    // AuthorCreatePost: AuthorCreatePost,
    // AuthorDeleteGet: AuthorDeleteGet,
    // AuthorDeletePost: AuthorDeletePost,
    // AuthorUpdateGet: AuthorUpdateGet,
    // AuthorUpdatePost: AuthorUpdatePost,
};

function getAuthorList(params) {
    let deferred = Q.defer();
    Author.find()
        .sort([
            ['family_name', 'ascending']
        ]).then((genresList) => {
            deferred.resolve(genresList);
        }).catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

function getAuthorDetail(reqId) {
    let deferred = Q.defer();
    let resutls = {};

    Q.all([
        Author.findById(reqId),
        Book.find({
            'author': reqId,
        }, 'title summary')
    ]).then((result) => {
        resutls.author = result[0];
        resutls.authors_books = result[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });

    return deferred.promise;
}

function AuthorDeleteGet(reqId) {
    let deferred = Q.defer();
    let resutls = {};

    Q.all([
        Author.findById(reqId),
        Book.find({
            'author': reqId
        })
    ]).then((result) => {
        resutls.author = result[0];
        resutls.authors_books = result[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;
    
}

function AuthorDeletePost(reqAuthorId) {
    let deferred = Q.defer();
    let resutls = {};

    Q.all([
        Author.findById(reqAuthorId),
        Book.find({
            'author': reqAuthorId
        })
    ]).then((result) => {
        resutls.author = result[0];
        resutls.authors_books = result[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;
    
}

function AuthorUpdateGet(reqId) {
    let deferred = Q.defer();
    Author.findById(reqId).then((author) => {
            deferred.resolve(author);
        }).catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

function AuthorUpdatePost(reqId, author) {
    let deferred = Q.defer();
    Author.findByIdAndUpdate(reqId, author, {}).then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}
