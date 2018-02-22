var mongoose = require('mongoose')
var User = require('./user.model')
var Comment = require('./comment.model')
var ArticleSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
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
  //缩略内容
  shortContent: {
    type: String,
    default: ''
  },
  //评论
  comment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  //标签
  tag: {
    type: Array,
    default: []
  },
  meta: {
    likeCount: {
      type: Number,
      default: 0
    }
  },
  title: {
    type: String,
    default: ''
  },
  imageCache: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('Article', ArticleSchema)