var express = require('express');
var session = require('express-session')
var router = express.Router();
var md5 = require('md5')

require('../mongodb/config/mongoose')
var User = require('../mongodb/model/user.model')
var Article = require('../mongodb/model/article.model')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});









module.exports = router;
