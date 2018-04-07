/*authorModel*/
var Author  = require('../models/authorModel');
/*bookModel*/
var Book  = require('../models/bookModel');
/*async*/
var async = require('async');
/*body,validationResult */
const {body, validationResult } = require('express-validator/check');
/*sanitizeBody*/
const { sanitizeBody } = require('express-validator/filter');



/**
 * exports.author_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Author list');
};
 */
// Display list of all Authors.

exports.author_list = function(req, res) {
    Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('./author/authorListView', { title: 'Author List', author_list: list_authors });
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
            .find({ 'author': req.params.id },'title summary')
            .exec(callback);
          },

    },function (err, results) {  
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
            title: 'Author Detail', author: results.author, author_books: results.authors_books 
        });


    });
  };


// Display Author create form on GET.
/*
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};
*/
exports.author_create_get = function(req, res, next ) {
	res.render('./author/authorForm', {title: 'Create Author'})
}
// Handle Author create on POST.
/*
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};
*/
exports.author_create_post = [
	// validate fields.
	body('first_name')
		.isLength({min: 1})
		.trim()
		.withMessage('First name must be specified.')
		.isAlphanumeric()
		.withMessage('First name has non-alphanumeric characters.'),
	body('family_name')
		.isLength({ min: 1 })
		.trim()
		.withMessage('Family name must be specified.')
		.isAlphanumber()
		.withMessage('Family name has non-alphanumeric characters.'),
	body('date_of_birth', 'Invalid data of birth')
		.optional({checkFalsy: true})
		.isISO8601(),
	body('date_of_death', 'Invalid data of death')
		.optional({checkFalsy: true})
		.isISO8601(),
	
	// Sanitize fields.
	sanitizeBody('first_name').trim().escape(),
	senitizeBody('family_name').trim().escape(),
	sanitizeBody('date_of_birth').toDate(),
	sanitizeBody('date_of_death').toDate(),
	
	// Process request after validation and sanitization
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		
		if(!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/errors messages.
			req.render('./author/authorForm', { title: 'Create Author', author: req.body, errors: errors.array()});
			return;
			
		} else {
			// Data from form is valid.
			
			// Create an Author object with escaped and trimmed data.
			var author = new Author(
			{
				first_name: req.body.first_name,
				family_name: req.body.family_name,
				date_of_birth: req.body.date_of_birth,
				date_of_death: req.body.date_of_death
			});
			
			author.save(function(err){
				if(err) {
					return next(err);
				}
				// Successful - redirect to new author record.
				res.redirect(author.url);
			})
			
			
		}
	}
	
]
// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
