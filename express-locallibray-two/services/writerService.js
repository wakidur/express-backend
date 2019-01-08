/**
 * Require Model
 */
const Writer = require('../models/writerModule');
const Q = require('q');


// Display list of all Writers.
function getAllWriter() {
    let deferred = Q.defer();
    Writer
        .find()
        .sort([
            ['family_name', 'ascending']
        ]).then((result) => {
            deferred.resolve(result);
        }).catch((err) => {
            deferred.reject(err);
        });
    return deferred.promise;


}
// Display detail page for a specific Writers.
function getWriterUseById(id) {
    let deferred = Q.defer();
    let results = {};

    Q.all([
        Writer.findById(id)
    ]).then((result) => {
        results.writer = result[0];
        deferred.resolve(results);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;

}

// Handle Writers create on POST.
function createWriterbyPost(writer) {
    let deferred = Q.defer();
    writer.save().then((result) => {
        deferred.resolve(result);
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;

}
// Display Writers delete form on GET.
function getWriterDeleteId(id) {

}

// Handle Writers delete on POST.
function postWriterDeleteId(params) {

}
// Display Writers update form on GET.
function getWriterUpdateId(params) {

}
// Handle Writers update on POST.
function postWriterUpdateId(params) {

}

module.exports = {
    getAllWriter,
    getWriterUseById,
    createWriterbyPost,
    getWriterDeleteId,
    postWriterDeleteId,
    getWriterUpdateId,
    postWriterUpdateId
};