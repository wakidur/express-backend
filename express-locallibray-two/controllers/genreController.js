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
exports.getGenreDeleteGet = getGenreDeleteGet;
exports.genreDeletePost = genreDeletePost;
exports.genreUpdateGet = genreUpdateGet;
exports.genreUpdatePost = genreUpdatePost;



// Display list of all Genre.
function genreList(req, res, next) {
    genreService.getGenreList(req, res).then((result) => {
        let newArray = [];

        let currentPage = result.page;
        let countTotal = result.total;
        let limit = result.limit;
        let PossiblePages = Math.trunc(countTotal/limit) + 1;
        

        result.docs.forEach((element, key) => {
            let newObject = {};
            newObject.name = element.name;
            newObject.url = element.url;
            newObject.count = key + 1;
            newArray.push(newObject);
        });

        
        res.render('./genre/genreListView', {
            title: 'Genre list',
            genreList: newArray,
            currentPage: currentPage,
            countTotal: countTotal,
            limit: limit,
            PossiblePages: PossiblePages
           
        });
    }).catch((err) => {
        req.flash('errors', err);
        return next(err);

    });
}

// Display detail page for a specific Genre.
function genreDetail(req, res, next) {
    genreService.getGenreDetail(req.params.id).then((results) => {
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
        min: 3,
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
                        // res.redirect(genre.url);
                         res.redirect('/genre/genre');
                    });
                }
            }).catch((err) => {
                req.flash('errors', err);
                return next(err);
            });
        }
    }
];


// Display Genre delet form on Get 
function getGenreDeleteGet(req, res, next) {
    genreService.genreDeleteGet(req.params.id).then((result) => {
        if (result.genre == null) {
             res.redirect('/genre/genre');
        }
        //successfull, so render.
        res.render('./genre/genreDeleteView',{
            title: 'Delete Genre',
            genre: result.genre
        });
    }).catch((err) => {
        res.flash('error', err);
    });
}

function genreDeletePost(req, res) {
    genreService.genreDeleteById(req.params.id).then((result) => {
        // success
        // req.flash('message', result);
        req.flash('success', {
            msg: result
        });
        
        res.redirect('/genre/genre');
        
    }).catch((err) => {
        res.flash('error', err);
    });
}

// Display genre update form on get 
function genreUpdateGet(req, res) {
    genreService.genreUpdateGet(req.params.id).then((result) => {
        res.render('./genre/createGenreFormView',{
            title: "Update Genre",
            genre: result
        }); 
    }).catch((err) => {
        req.flash("error" , err);
    });
}
// Handle Genre update form on POST
exports.genreUpdatePost = [
    body('name','Genre name required').isLength({min: 2, max: 30}).trim(),
    sanitizeBody('name').trim().escape(),
    (req,res,next) => {
        const errors = validationResult(req);
        let genre = new Genre({
            name: req.body.name,
            _id: req.body.id
        });
        if (!errors.isEmpty()) {
            res.render('./genre/createGenreFormView',{
                title: 'Update Genre',
                genre: genre,
                errors: errors.array()
            });
            return;

        } else {
            genreService.genreUpdatePost(req.params.id, genre).then((results) => {
                // Successful - redirect to genre detail page.
                res.redirect(results.url);
            }).catch((err) => {
                return next(err);
            });
        }
    }
]

