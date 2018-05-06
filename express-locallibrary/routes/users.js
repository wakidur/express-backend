var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.get('/', function(req, res, next) {
  res.render('users', { 
    title: 'user',
    id: 123456,
    name: 'Wakidur' ,
    department: 'Web'
  });
});

router.get('/cool', function(req, res, next) {
  res.send("You're so cool");
});

module.exports = router;
