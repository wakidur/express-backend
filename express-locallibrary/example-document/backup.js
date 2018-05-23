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