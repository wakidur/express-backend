app.all('/secret', function(req, res, next) {
	console.log('Accessing the secret section....');
	next();// pass control to the next handler
});

// wiki.js - wiki route module

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

//To use the router in our main app file we would then 

var wiki = require('./wiki');
app.use('/wiki', wiki);