var express = require('express');
var router = express.Router();

// Home page route
router.get('/', () => {
	res.send("Wiki home page");
});

router.get('/about', (req, res) => {
	res.send('About this wiki');
});

module.exports = router;