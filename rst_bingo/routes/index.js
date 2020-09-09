var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bingo!' });
});

router.get('/main', function(req, res, next){
  res.render('main', { title: 'Bingo!', username: req.query.username });
});

module.exports = router;
