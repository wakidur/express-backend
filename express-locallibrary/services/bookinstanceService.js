var BookInstance = require('../models/bookinstanceModel');
var Book = require('../models/bookModel')

var Q = require('q');



module.exports = {
    getBookinstanceList: getBookinstanceList,
    getBookinstanceDetail: getBookinstanceDetail,
    BookinstanceCreateGet: BookinstanceCreateGet,
    BookinstanceCreatePost: BookinstanceCreatePost,
    BookinstanceDeleteGet : BookinstanceDeleteGet,
    BookinstanceDeletePost : BookinstanceDeletePost,
    BookinstanceUpdateGet : BookinstanceUpdateGet,
    BookinstanceUpdatePost: BookinstanceUpdatePost,
    findByIdBookinstanceUpdatePost: findByIdBookinstanceUpdatePost
};


function getBookinstanceList() {
    let deferred = Q.defer();
    BookInstance.find().populate('book').then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

function getBookinstanceDetail(reqId) {
    let deferred = Q.defer();
    BookInstance.findById(reqId)
        .populate('book')
        .then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}


function BookinstanceCreateGet() {
    let deferred = Q.defer();
    Book.find({},'title').then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

function BookinstanceCreatePost() {
    let deferred = Q.defer();
    Book.find({}, 'title').then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

function BookinstanceDeleteGet(reqId) {
    let deferred = Q.defer();
    BookInstance.findById(reqId)
        .populate('book').then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

function BookinstanceDeletePost(reqId) {
    let deferred = Q.defer();
    BookInstance.findByIdAndRemove(reqId)
        .populate('book').then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

function BookinstanceUpdateGet(reqId) {
    let deferred = Q.defer();
    let resutls = {};
    Q.all([
        BookInstance.findById(reqId).populate('book'),
        Book.find()
        ]).then((value) => {
        resutls.authors = value[0];
        resutls.genres = value[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;
}

function BookinstanceUpdatePost(params) {
    let deferred = Q.defer();
    Book.find({}, 'title').then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}
function findByIdBookinstanceUpdatePost(req, bookinstance) {
    let deferred = Q.defer();
    BookInstance.findByIdAndUpdate(req, bookinstance, {}).then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}
