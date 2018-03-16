/**
 * Created by linGo on 2018/3/11.
 */

var mongoose = require('mongoose');
var Tag = require('./tag.model')

var Article = require('./article.model'),
  User = require('./user.model')

var TagSchema = new mongoose.Schema({
  image: {
    type: String,
    default: ''
  },
  tagName: {
    type: String,
    default: '',
    unique: true
  },
  fans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  articles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }]
})

module.exports = mongoose.model( 'Tag', TagSchema)