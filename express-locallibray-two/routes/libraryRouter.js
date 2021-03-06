const express = require('express');
const router = express.Router();

// Require controller modules.
let genre_controller = require('../controllers/genreController');
let authorController = require('../controllers/authorController');
let writerController = require('../controllers/writerController');

/**
 * Genre Routes
 */

// GET request for creating a Genre.
router
    .route('/genre/create')
    .get(genre_controller.getGenreCreateForm)
    .post(genre_controller.postGenreCreateForm);
// Delete Genre
router
    .route('/genre/:id/delete')
    .get(genre_controller.getGenreDeleteGet)
    .post(genre_controller.genreDeletePost);
// Edit Genre
router
    .route('/genre/:id/update')
    .get(genre_controller.genreUpdateGet)
    .post(genre_controller.genreUpdatePost);

// GET request for one Genre.
router
    .route('/genre/:id')
    .get(genre_controller.genreDetail);

router
    .route('/genre')
    .get(genre_controller.genreList);



/**
 * Writer 
 */

 // GET & POST request for creating Writer.
router
    .route('/writer/create')
    .get(writerController.writerCreateGet)
    .post(writerController.writerCreatePost);
// GET & POST request to delete Writer.   
router
    .route('/writer/:id/delete')
    .get(writerController.writerDeleteGet)
    .post(writerController.writerDeletePost);
// GET & POST request to update Writer.
router
    .route('/writer/:id/update')
    .get(writerController.writerUpdateGet)
    .post(writerController.writerUpdatePost);
// GET request for one Writer.
router
    .route('/writer/:id')
    .get(writerController.writerDetail);
// GET request for list of all Writer.
router
    .route('/writer')
    .get(writerController.writerList);


/**
 * /// AUTHOR ROUTES ///
 */

// Author Create

router
    .route('/author/create')
    .get(authorController.authorCreateGet)
    .post(authorController.authorCreatePost);

router.route('/author').get(authorController.getAllAuthor);








module.exports = router;