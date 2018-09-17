const express = require('express');
const router = express.Router();

// Require controller modules.
let genre_controller = require('../controllers/genreController');

/**
 * Genre Routes
 */
router.route('/genre').get(genre_controller.genreList);
router
    .route('/genre/create')
    .get(genre_controller.getGenreCreateForm)
    .post(genre_controller.postGenreCreateForm);

// GET request for one Genre.
router.route('/genre/:id').get(genre_controller.genreDetail);

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


module.exports = router;