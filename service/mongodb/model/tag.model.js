/**
 * Created by linGo on 2018/3/11.
 */

var mongoose = require('mongoose');
var Tag = require('./tag.model')

var TagSchema = new mongoose.Schema({
  image: {
    type: String,
    default: ''
  },
  tagName: {
    type: String,
    default: ''
  },
  fans: {
    type: Number,
    default: 0
  },
  articles: {
    type: Number,
    default: 0
  }
})