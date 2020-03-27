var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { globalTitle: 'Visualisation des cas de Covid-19' });
});

module.exports = router;
