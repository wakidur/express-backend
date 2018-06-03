/*
// Display list of all Genre.
exports.genre_list = function(req, res, next) {
    Genre.find()
        .sort([
            ['name', 'ascending']
        ])
        .exec(function(err, list_genres) {
            if (err) {
                return next(err);
            }
            //Successful , so render
            res.render('./genre/genreListView', {
                title: 'Genre List',
                genre_list: list_genres
            });
        });

}
*/

/*
// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({
                'genre': req.params.id
            }).exec(callback);
        },
    }, function(err, results) {
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

*/

// Handle Genre create on POST.
exports.genre_create_post = [

    // Validate that the name field is not empty.
    body('name', 'Genre name required').isLength({
        min: 1
    }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre({
            name: req.body.name
        });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('./genre/genreFormView', {
                title: 'Create Genre',
                genre: genre,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({
                    'name': req.body.name
                })
                .exec(function(err, found_genre) {
                    if (err) {
                        return next(err);
                    }

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

                });
        }
    }
];

// Display Genre create form on GET.

// exports.genre_create_get = function(req, res, next) {
//     res.render('./genre/genreFormView', {
//         title: 'Create Genre'
//     });
// };


// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next) {
    genreService.genreDeleteGet(req.params.id).then((result) => {

    }).catch((err) => {

    });
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({
                'genre': req.params.id
            }).exec(callback);
        },
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        if (results.genre == null) { // No results.
            res.redirect('/catalog/genres');
        }
        // Successful, so render.
        res.render('./genre/genreDeleteView', {
            title: 'Delete Genre',
            genre: results.genre,
            genre_books: results.genre_books
        });
    });

};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res, next) {
    genreService.genreDeletePost().then((result) => {

    }).catch((err) => {

    });

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({
                'genre': req.params.id
            }).exec(callback);
        },
    }, function(err, results) {
        if (err) {
            return next(err);
        }
        // Success
        if (results.genre_books.length > 0) {
            // Genre has books. Render in same way as for GET route.
            res.render('./genre/genreDeleteView', {
                title: 'Delete Genre',
                genre: results.genre,
                genre_books: results.genre_books
            });
            return;
        } else {
            // Genre has no books. Delete object and redirect to the list of genres.
            Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
                if (err) {
                    return next(err);
                }
                // Success - go to genres list.
                res.redirect('/genres');
            });

        }
    });

};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res, next) {
    genreService.genreUpdateGet().then((result) => {

    }).catch((err) => {

    });

    Genre.findById(req.params.id, function(err, genre) {
        if (err) {
            return next(err);
        }
        if (genre == null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('./genre/genreFormView', {
            title: 'Update Genre',
            genre: genre
        });
    });

};

// Handle Genre update on POST.
exports.genre_update_post = [

    // Validate that the name field is not empty.
    body('name', 'Genre name required').isLength({
        min: 1
    }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data (and the old id!)
        var genre = new Genre({
            name: req.body.name,
            _id: req.params.id
        });


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('./genre/genreFormView', {
                title: 'Update Genre',
                genre: genre,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            genreService.genreUpdatePost().then((result) => {

            }).catch((err) => {

            });

            Genre.findByIdAndUpdate(req.params.id, genre, {}, function(err, thegenre) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to genre detail page.
                res.redirect(thegenre.url);
            });
        }
    }
];





genreService.genreDeleteGet().then((result) => {

}).catch((err) => {

});



// Author Controller

/*authorModel*/
var Author = require('../models/authorModel');
/*bookModel*/
var Book = require('../models/bookModel');
/*async*/
var async = require('async');
/*body,validationResult */
const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

let authorService = require('../services/authorService');

exports.author_list = authorList;
// Display list of all Authors.

// exports.author_list = function(req, res) {
//     Author.find()
//         .sort([
//             ['family_name', 'ascending']
//         ])
//         .exec(function(err, list_authors) {
//             if (err) { return next(err); }
//             //Successful, so render
//             res.render('./author/authorListView', { title: 'Author List', author_list: list_authors });
//         });

// };
function authorList(req, res) {
    authorService.getAuthorList().then((result) => {
        res.render('./author/authorListView', {
            title: 'Author List',
            author_list: result
        });
    }).catch((err) => {
        return next(err);
    });
};


// Display detail page for a specific Author.
/*
exports.author_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
};
*/
exports.author_detail = function (req, res, next) {
    async.parallel({
        author: function (callback) {
            Author
                .findById(req.params.id)
                .exec(callback);
        },
        authors_books: function (callback) {
            Book
                .find({
                    'author': req.params.id
                }, 'title summary')
                .exec(callback);
        },

    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.authors_books == null) {
            // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful , so render.

        res.render('./author/authorDetailView', {
            title: 'Author Detail',
            author: results.author,
            author_books: results.authors_books
        });


    });
};


// Display Author create form on GET.
/*
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};
*/
exports.author_create_get = function (req, res, next) {
    res.render('./author/authorFormView', {
        title: 'Create Author'
    });
}
// Handle Author create on POST.
/*
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};
*/
exports.author_create_post = [

    // Validate fields.
    body('first_name').isLength({
        min: 1
    }).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({
        min: 1
    }).trim().withMessage('Family name must be specified.')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({
        checkFalsy: true
    }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({
        checkFalsy: true
    }).isISO8601(),

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
            res.render('./author/authorFormView', {
                title: 'Create Author',
                author: req.body,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });
            author.save(function (err) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }
];




/*
// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};
*/
// Display Author delete form on GET.
exports.author_delete_get = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id).exec(callback)
        },
        authors_books: function (callback) {
            Book.find({
                'author': req.params.id
            }).exec(callback)
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.author == null) { // No results.
            res.redirect('/authors');
        }
        // Successful, so render.
        res.render('./author/authorDeleteView', {
            title: 'Delete Author',
            author: results.author,
            author_books: results.authors_books
        });
    });

};

/*
// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};
*/

// Handle Author delete on POST.
exports.author_delete_post = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findById(req.body.authorid).exec(callback)
        },
        authors_books: function (callback) {
            Book.find({
                'author': req.body.authorid
            }).exec(callback)
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        // Success.
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('./author/authorDeleteView', {
                title: 'Delete Author',
                author: results.author,
                author_books: results.authors_books
            });
            return;
        } else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) {
                    return next(err);
                }
                // Success - go to author list.
                res.redirect('/authors')
            })

        }
    });

};


// Display Author update form on GET.
// exports.author_update_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author update GET');
// };

exports.author_update_get = function (req, res, next) {

    Author.findById(req.params.id, function (err, author) {
        if (err) {
            return next(err);
        }
        if (author == null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('./author/authorFormView', {
            title: 'Update Author',
            author: author
        });

    });
};
// Handle Author update on POST.
// exports.author_update_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Author update POST');
// };

exports.author_update_post = [

    // Validate fields.
    body('first_name').isLength({
        min: 1
    }).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({
        min: 1
    }).trim().withMessage('Family name must be specified.')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({
        checkFalsy: true
    }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({
        checkFalsy: true
    }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data (and the old id!)
        var author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('./author/authorFormView', {
                title: 'Update Author',
                author: author,
                errors: errors.array()
            });
            return;
        } else {
            // Data from form is valid. Update the record.
            Author.findByIdAndUpdate(req.params.id, author, {}, function (err, theauthor) {
                if (err) {
                    return next(err);
                }
                // Successful - redirect to genre detail page.
                res.redirect(theauthor.url);
            });
        }
    }
];