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


// bookInstance


/*----------------- require Model -----------------*/
var BookInstance = require('../models/bookinstanceModel');
var Book = require('../models/bookModel')
var async = require('async')

/*-----------------require express-validator -----------------*/
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

/*-----------------require BooksInstance Service -----------------*/
var BooksInstanceService = require('../services/bookinstanceService');

/*----------------- exports controller-----------------*/
exports.bookInstanceList = bookInstanceList;


// Display list of all BookInstances.
function bookInstanceList(req, res, next) {
    BooksInstanceService.getBookinstanceList().then((values) =>{
        res.render('./bookinstance/bookinstanceListView', {
            title: 'Book Instance List',
            bookinstance_list: values
        });
    }).catch((err) => {
        return next(err);
    });
   
}

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function (req, res, next) {
    BooksInstanceService.getBookinstanceDetail(req.params.id).then((bookinstance) => {
        if(bookinstance == null) {
            // no result 
            var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
        }
        // successful, so render.
        res.render('./bookinstance/bookinstanceDetailView', {title: "Book", bookinstance: bookinstance});
    }).catch((err) => {
        return next(err);
    });
    BookInstance.findById(req.params.id)
        .populate('book')
        .exec(function (err, bookinstance) { 
            if (err) {
                return next(err);
            }
            if(bookinstance == null) {
                // no result 
                var err = new Error('Book copy not found');
                    err.status = 404;
                    return next(err);
            }
            // successful, so render.
            res.render('./bookinstance/bookinstanceDetailView', {title: "Book", bookinstance: bookinstance});
         });
  };


// Display BookInstance create form on GET.
// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {

    Book.find({},'title')
   .exec(function (err, books) {
     if (err) { return next(err); }
     // Successful, so render.
     res.render('./bookinstance/bookInstanceFormView', {title: 'Create BookInstance', book_list:books } );
   });

};
// Handle BookInstance create on POST.
// exports.bookinstance_create_post = function (req, res) {
//     res.send('NOT IMPLEMENTED: BookInstance create POST');
// };

exports.bookinstance_create_post = [

    // Validate fields.
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance(
          { book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({},'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('./bookinstance/bookInstanceFormView', { title: 'Create BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid
            bookinstance.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(bookinstance.url);
                });
        }
    }
];
// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res, next) {

    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
        if (err) { return next(err); }
        if (bookinstance==null) { // No results.
            res.redirect('/catalog/bookinstances');
        }
        // Successful, so render.
        res.render('./bookinstance/bookinstanceDeleteView', { title: 'Delete BookInstance', bookinstance:  bookinstance});
    })

};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res, next) {
    
    // Assume valid BookInstance id in field.
    BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of BookInstance items.
        res.redirect('/bookinstances');
        });

};

// Display BookInstance update form on GET.
// exports.bookinstance_update_get = function (req, res) {
//     res.send('NOT IMPLEMENTED: BookInstance update GET');
// };

exports.bookinstance_update_get = function(req, res, next) {

    // Get book, authors and genres for form.
    async.parallel({
        bookinstance: function(callback) {
            BookInstance.findById(req.params.id).populate('book').exec(callback)
        },
        books: function(callback) {
            Book.find(callback)
        },

        }, function(err, results) {
            if (err) { return next(err); }
            if (results.bookinstance==null) { // No results.
                var err = new Error('Book copy not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('./bookinstance/bookInstanceFormView', { title: 'Update  BookInstance', book_list : results.books, selected_book : results.bookinstance.book._id, bookinstance:results.bookinstance });
        });

};

// Handle bookinstance update on POST.
// exports.bookinstance_update_post = function (req, res) {
//     res.send('NOT IMPLEMENTED: BookInstance update POST');
// };

exports.bookinstance_update_post = [

    // Validate fields.
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('book').trim().escape(),
    sanitizeBody('imprint').trim().escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped/trimmed data and current id.
        var bookinstance = new BookInstance(
          { book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: req.params.id
           });

        if (!errors.isEmpty()) {
            // There are errors so render the form again, passing sanitized values and errors.
            Book.find({},'title')
                .exec(function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.render('./bookinstance/bookInstanceFormView', { title: 'Update BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors.array(), bookinstance:bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err,thebookinstance) {
                if (err) { return next(err); }
                   // Successful - redirect to detail page.
                   res.redirect(thebookinstance.url);
                });
        }
    }
];


