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