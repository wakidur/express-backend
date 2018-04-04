var Author  = require('../models/authorModel');
var Book  = require('../models/bookModel');
var async = require('async');


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
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

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
