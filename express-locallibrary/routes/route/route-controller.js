/**
 * app.get(/.*fish$/, function(req, res){
    ...
})
 */

// Route parameters
// http://localhost:3000/users/32/books/8989

app.get('/users/:userId/books/:bookId', function (req, res) {
    // Access userId via: req.params.userId
    // Access bookId via: req.params.bookId
    res.send(req.params);
})