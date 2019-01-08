const writerDataService = require('../services/writerService');
const Writer = require('../models/writerModule');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

function writerList(req, res) {
    writerDataService.getAllWriter().then((result) => {
        res.render('./writer/writerListView', {
            title: 'Writer List',
            writerList: result
        });
    }).catch((err) => {
        req.flash('error', err);
    });  
}

function writerDetail(req, res) {
    writerDataService.getWriterUseById(req.params.id).then((result) => {
        res.render('./author/writerDetailView', {
            title: 'Author Detail',
            author: results.author,
            author_books: results.authors_books
        });
    }).catch((err) => {
        req.flash('errors', err );
        
    });
    
}

function writerCreateGet(req, res) {
    res.render('./writer/writerFormView', {
        title: 'Create Author'
    });
    
}

exports.writerCreatePost = [
    // Validate fields.
    body('first_name')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),

    body('family_name')
    .isLength({
        min: 1
    })
    .trim()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),

    body('date_of_birth', 'Invalid date of birth')
    .optional({
        checkFalsy: true
    })
    .isISO8601(),

    body('date_of_death', 'Invalid date of death')
    .optional({
        checkFalsy: true
    })
    .isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('./writer/writerFormView', {
                title: 'Create Author',
                author: req.body,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Writer({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });
            writerDataService.createWriterbyPost(author).then((result) => {
                res.redirect('/genre/'+result.url);
            }).catch((err) => {
                req.flash('errors', err);
            });
        }
    }
];

function writerDeleteGet(req, res) {
    
}

exports.writerDeletePost = [];

function writerUpdateGet(req, res) {
    
}

exports.writerUpdatePost = [];



exports.writerList = writerList;
exports.writerDetail = writerDetail;
exports.writerCreateGet = writerCreateGet;
exports.writerDeleteGet = writerDeleteGet;
exports.writerUpdateGet = writerUpdateGet;
