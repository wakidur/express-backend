// wiki.js wiki route module.

var express = require('express');
var router = express.Router();

// Hove page route.
router.get('/', function(req, res){
	res.send('Wiki home page');
})

// About page route.
round.get('/about', function(req, res){
	res.send('About this wiki');
});

module.exports = router;