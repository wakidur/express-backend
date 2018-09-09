/**
 * require model
 */
const mongoose = require('mongoose');
let Genre = require('../models/genreModel');
/*-----------------require genre Service -----------------*/
let genreService = require('../services/genreService');


// Display Genry create form on GET 
function getGenreCreateForm(req, res) {
    res.render('./genre/createGenreFormView', {title: 'Create Genre'});
}

function postGenreCreateForm(req, res) {
    // Validate that the name field is not empty.
    req.assert('name', 'Email is not valid').isLength({ min: 3 }).trim();
    req.sanitizeBody('name').trim();

    const errors = req.validationErrors();
    const genre = new Genre({
        name: req.body.name,
    });

    // Process request after validation and sanitization.
    if (errors) {
        req.flash('errors', errors);
        res.render('./genre/createGenreFormView',{
            title: 'Create Genre',
            genre: genre,
            errors: errors
        });
        return;
    } else {
        genreService.genreCreatePost(req.body.name).then((found_genre) => {
            if (found_genre) {
                // Genre exists, redirect to its detail page.
                res.redirect(found_genre.url);
            } else {
                genre.save(function(err) {
                    if (err) {
                        return next(err);
                    }
                    // Genre saved. Redirect to genre detail page.
                    res.redirect(genre.url);
                });
            }
        }).catch((err) => {
            return next(err);
        });
    }

    
    
}

// Display detail page for a specific Genre.
function genreDetail(req, res, next) {
    let id = mongoose.Types.ObjectId(req.params.id);
    genreService.getGenreDetail(id).then((results) => {
        if (results.genre == null) {
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('./genre/genreDetailView', {
            title: "Genre Detail",
            genre: results.genre,
        });
    }).catch((err) => {
        return next(err);
    });
}
module.exports = {
    getGenreCreateForm,
    postGenreCreateForm,
    genreDetail
}