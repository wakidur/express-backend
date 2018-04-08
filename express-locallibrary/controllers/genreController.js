/*import  genreModel*/
var Genre = require('../models/genreModel');

/* import  bookModel */
var Book = require('../models/bookModel');

/* Import validation and sanitisation methods */
// const { body, validationResult } = require('express-validator/check');
// const { sanitizeBody  } = require('express-validator/filter');

/* Import async */
var async = require('async');

/**
* Display list of all Genre.
	exports.genre_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre list');
	};
 
 */

// Display list of all Genre.
exports.genre_list = function (req, res, next) {
	Genre.find()
		.sort([
			['name', 'ascending']
		])
		.exec(function (err, list_genres) {
			if (err) {
				return next(err);
			}
			//Successful , so render
			res.render('./genre/genreListView', {
				title: 'Genre List',
				genre_list: list_genres
			})
		});

}

// Display detail page for a specific Genre.
/*
exports.genre_detail = function (req, res) {
	res.send('NOT IMPLEMENTED: Genre detail: ' + req.params.id);
};
*/

// Display detail page for a specific Genre.
exports.genre_detail = function (req, res, next) {
	async.parallel({
		genre: function (callback) {
			Genre.findById(req.params.id).exec(callback);
		},
		genre_books: function (callback) {
			Book.find({
				'genre': req.params.id
			}).exec(callback);
		},

	}, function (err, results) {
		if (err) {
			return next(err);
		}
		if (results.genre == null) {
			// no results.
			var err = new Error('Genre not found');
			err.status = 404;
			return next(err);
		}  
		
		// successfull, so render 
		res.render('./genre/genreDetailView', {
			title: "Genre Detail",
			genre: results.genre,
			genre_books: results.genre_books
		});
	});
};


// Display Genre create form on GET.
/*
exports.genre_create_get = function (req, res) {
	res.send('NOT IMPLEMENTED: Genre create GET');
};
*/
exports.genre_create_get = function (req, res, next) {
	res.render('./genre/genreFormView', 
	{ title: 'Create Genre'});
};

// Handle Genre create on POST.
/*
exports.genre_create_post = function (req, res) {
	res.send('NOT IMPLEMENTED: Genre create POST');
};
*/
/*
// Handle Genre create on POST
exports.genre_create_post = [
	// validate that the name field is not empty
	body('name', 'Genre name required').isLength({ min: 1 }).trim(),

	// Sanitize  ( trim and escape ) the name field
	sanitizeBody('name').trim().escape(),

	// Process request after validation  and sanitization

	(req, res, next) => {
		// Extranct the validation errors from a request.
		const errors = validationResult(req);

		// Create a genre object with escaped and trimmed data.
		var genre = new Genre(
			{
				name: req.bodey.name
			}
		);

		if ( !errors.isEmpty() ) {
			// There are errors. Render the form again with sanitize values/error message.
			res.render('./genre/genreFormView', {
				title: "Create Genre", 
				genre: genre,
				errors: errors.array()
			});
			return;
			
		} else {
			// data from form is valid.
			// check if genre with same name already exists.
			Genre.findOne({ 'name': req.body.name })
				.exec((err, found_genre) => {
					if (err) {
						return next(err);
					}
					if( found_genre ){
						// Genre exists, redirect to its detail page.
						res.redirect( found_genre.url );
					} else {
						genre.save((err) => {
							if (err) {
								return next(err);
							}
							// Genre saved. Redirect to genre detail page.
							res.redirect(genre.url);
						});
					}
				});
		}
	}

];
*/
// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
	res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
	res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
	res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
	res.send('NOT IMPLEMENTED: Genre update POST');
};