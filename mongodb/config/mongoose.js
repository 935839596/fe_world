var mongoose = require('mongoose');
var config = require('./config');
mongoose.Promise = global.Promise;
var db = function(){
  var db = mongoose.connect(config.mongodb);
  // require('../model/user.model')
  return db;
}
db()