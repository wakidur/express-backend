/*----------------- require Model -----------------*/
/*authorModel*/
var Author = require('../models/authorModel');
/*bookModel*/
var Book = require('../models/bookModel');
/*----------------- require q -----------------*/
let Q = require('q');

/*----------------- exports service-----------------*/
module.exports = {
    getAuthorList: getAuthorList,
    getAuthorDetail: getAuthorDetail,
    AuthorDeleteGet: AuthorDeleteGet,
    AuthorDeletePost: AuthorDeletePost,
    AuthorUpdateGet: AuthorUpdateGet,
    AuthorUpdatePost: AuthorUpdatePost
};

// get author list
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

// get author detail
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

// get author delete id

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

// Post author delete
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

// get author update

function AuthorUpdateGet(reqId) {
    let deferred = Q.defer();
    Author.findById(reqId).then((author) => {
            deferred.resolve(author);
        }).catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;
}

// post author update
function AuthorUpdatePost(reqId, author) {
    let deferred = Q.defer();
    Author.findByIdAndUpdate(reqId, author, {}).then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}
