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


//14-03-2018

// This works with older versions of mongodb version ~ 2.2.33 

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', function(err, db){
	if(err) {
		throw err;
	}
	db.collection('mammals').find().toArray(function(err, result){
		if(err){
			throw err;
		}
		console.log(result);
	})
	
});


// For mongodb version 3.0 and up 

let MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/animals', function(err, client){
	
	if(err) {
		throw err;
	}
	let db = client.db('animals');
	db.collection('mammals').find().toArray(function(err, result) {
		if(err) {
			throw err;
		}
		console.log(result);
		client.close();
	})
})





















