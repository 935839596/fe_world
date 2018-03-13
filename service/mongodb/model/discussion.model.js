var mongoose = require('mongoose')

var  User = require('../../mongodb/model/user.model');
var Comment = require('./comment.model')

var DiscussionSchema = new mongoose.Schema({
  //使用ObjectId
  /*discussionId: {
    type: String,
    unique: true
  },*/
  //创建时间
  buildTime: {
    type: String,
    default: Date.now()
  },
  //作者
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //内容
  content: {
    type: String,
    default: ''
  },
  comment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  meta: {
    likeCount: {
      type: Number,
      default: 0
    },
    likeUser: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  imageCache: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('Discussion', DiscussionSchema)
