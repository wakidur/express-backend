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
router.get('/genre/:id', genre_controller.genreDetail);


module.exports = router;