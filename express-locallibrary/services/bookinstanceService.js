/*----------------- require Model -----------------*/
var BookInstance = require('../models/bookinstanceModel');
var Book = require('../models/bookModel')
/*----------------- require q -----------------*/
var Q = require('q');


/*----------------- exports service-----------------*/
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

// get Bookinstance List
function getBookinstanceList() {
    let deferred = Q.defer();
    BookInstance.find().populate('book').then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

// get Bookinstance Detail
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

// Bookinstance Create Get
function BookinstanceCreateGet() {
    let deferred = Q.defer();
    Book.find({},'title').then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

// Bookinstance Create Post
function BookinstanceCreatePost() {
    let deferred = Q.defer();
    Book.find({}, 'title').then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

// Bookinstance Delete Get
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

// Bookinstance Delete Post
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

// Bookinstance Update Get
function BookinstanceUpdateGet(reqId) {
    let deferred = Q.defer();
    let resutls = {};
    Q.all([
        BookInstance.findById(reqId).populate('book'),
        Book.find()
        ]).then((value) => {
        resutls.bookinstance = value[0];
        resutls.books = value[1];
        deferred.resolve(resutls);
    }).catch((err) => {
        deferred.resolve(err);
    });
    return deferred.promise;
}

// Bookinstance Update Post
function BookinstanceUpdatePost(params) {
    let deferred = Q.defer();
    Book.find({}, 'title').then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}

// findById Bookinstance Update Post
function findByIdBookinstanceUpdatePost(req, bookinstance) {
    let deferred = Q.defer();
    BookInstance.findByIdAndUpdate(req, bookinstance, {}).then((results) => {
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
}
