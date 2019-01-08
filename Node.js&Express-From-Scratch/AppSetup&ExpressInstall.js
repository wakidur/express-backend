// [Part 2] - App Setup & Express Install
const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send('Hello world');
});

app.listen(3000, () => {
    console.log('Server started on port 3000...');
});


// [Part 3] - Pug Template Engine
const express3 = require('express');
const path = require('path');

// init app
cons app = express();

// load view Engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home Route 
app.get('/', function (req, res) {
    // res.send("hello world");
    let articles = [{
        id: 1,
        title: 'Article one',
        author: 'Brad Traversy',
        body: 'This is article one'
    },
    {
        id: 2,
        title: 'Article Two',
        author: 'John Doe',
        body: 'This is article one'
    },
    {
        id: 3,
        title: 'Article Three',
        author: 'John Doe',
        body: 'This is article one'
    }]
    res.render('index', {
        title: 'Articles',
        articles: articles
    });
});

// Add Route 
app.get('/articles/add', (req, res) => {
    res.render('add-article', {
        title: 'Add Article'
    });
});

app.listen(3000, () => {
    console.log(`Server started on port 3000...`);
});