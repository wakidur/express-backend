const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;
// Check for BD connection 
db.once('open', () => {
    console.log('Connected to MongoDB');
});
//check for BD error 
db.on('error', (err) => {
    console.log(err);
})

// init app
const app = express();

// Bring in Models
let articles = require('./models/articles');

//Load view Engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//Home Route 
/*
app.get('/', (req, res) => {
    res.send('Hello world');
});
*/
app.get('/', (req, res) => {
    articles.find({}, function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: "Articles",
                articles: articles
            });
        }
        // try {
        //     res.render('index', {
        //         title: "Articles",
        //         articles: articles
        //     });
        // } catch (err) {
        //     console.log(err);
        // }
    });

});

// Add articles
app.get('/articles/add', (req, res) => {
    res.render('./articles/addArticle', {
        title: "Add Article"
    });
})
app.listen(3000, () => {
    console.log("Server started on port 3000...");
});