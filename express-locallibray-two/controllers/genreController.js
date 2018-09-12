/**
 * require model
 */
const mongoose = require('mongoose');
let Genre = require('../models/genreModel');
/*-----------------require genre Service -----------------*/
/*-----------------require express-validator -----------------*/
/* Import validation and sanitisation methods */
const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');
let genreService = require('../services/genreService');

exports.genreList = genreList;
exports.getGenreCreateForm = getGenreCreateForm;
exports.genreDetail = genreDetail;



// Display list of all Genre.
function genreList(req, res, next) {
    genreService.getGenreList().then((result) => {
        let newArray = [];
        let countTotal = result.length;

        result.forEach((element, key) => {
            let newObject = {};
            newObject.name = element.name;
            newObject.url = element.url;
            newObject.count = key + 1;
            newArray.push(newObject);
        });
        
        console.log(newArray);

        res.render('./genre/genreListView', {
            title: 'Genre list',
            genreList: newArray,
            countTotal: countTotal
        });
       
    }).catch((err) => {
        req.flash('errors', err);
        return next(err);

    });
}
// Display Genry create form on GET 
function getGenreCreateForm(req, res) {
    res.render('./genre/createGenreFormView', {
        title: 'Create Genre'
    });
}

// Handle Genre create on POST.
exports.postGenreCreateForm = [

    // Validate that the name field is not empty.
    body('name', 'Genre name required').isLength({
        min: 1,
        max: 30
    }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre({
            name: req.body.name
        });

        if (!errors.isEmpty()) {
            req.flash('errors', errors.array());
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('./genre/createGenreFormView', {
                title: 'Create Genre',
                genre: genre,
                errors: errors.array()
            });
            return;
            // return res.status(422).json({ errors: errors.array() });
        } else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            genreService.genreCreatePost(req.body.name).then((found_genre) => {
                if (found_genre) {
                    // Genre exists, redirect to its detail page.
                    res.redirect(found_genre.url);
                } else {
                    genre.save(function (err) {
                        if (err) {
                            req.flash('errors', err);
                            return next(err);
                        }
                        // Genre saved. Redirect to genre detail page.
                        res.redirect(genre.url);
                    });
                }
            }).catch((err) => {
                req.flash('errors', err);
                return next(err);
            });
        }
    }
];

// function postGenreCreateForm(req, res) {
//     // Validate that the name field is not empty.
//     req.assert('name', 'Email is not valid').isLength({ min: 3 }).trim();
//     req.sanitizeBody('name').trim();

//     const errors = req.validationErrors();
//     const genre = new Genre({
//         name: req.body.name,
//     });

//     // Process request after validation and sanitization.
//     if (errors) {
//         req.flash('errors', errors);
//         res.render('./genre/createGenreFormView',{
//             title: 'Create Genre',
//             genre: genre,
//             errors: errors
//         });
//         return;
//     } else {
//         genreService.genreCreatePost(req.body.name).then((found_genre) => {
//             if (found_genre) {
//                 // Genre exists, redirect to its detail page.
//                 res.redirect(found_genre.url);
//             } else {
//                 genre.save(function(err) {
//                     if (err) {
//                         return next(err);
//                     }
//                     // Genre saved. Redirect to genre detail page.
//                     res.redirect(genre.url);
//                 });
//             }
//         }).catch((err) => {
//             return next(err);
//         });
//     }



// }

// Display detail page for a specific Genre.
function genreDetail(req, res, next) {
    let id = mongoose.Types.ObjectId(req.params.id);
    genreService.getGenreDetail(id).then((results) => {
        if (results.genre == null) {
            var err = new Error('Genre not found');
            err.status = 404;
            req.flash('errors', err);
            return next(err);
        }
        res.render('./genre/genreDetailView', {
            title: "Genre Detail",
            genre: results.genre,
        });
    }).catch((err) => {
        req.flash('errors', err);
        return next(err);
    });
}