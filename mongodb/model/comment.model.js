var mongoose = require('mongoose')

var CommentSchema = new mongoose.Schema({
  /*使用_id作为主键
    commentId: {
     type: String,
      unique: true
    },
  */
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //创建时间
  pubTime: {
    type: String,
    default: Date.now()
  },
  //评论的种类，0代表自己发布（即评论文章的），1代表评论别人的评论
  type: {
    type: Number,
    default: '0'
  },
  toArticleId: {
    type: String,
    default: ''
  },
  //如果是1，则不为空
  toCommentId: {
    type: String,
    default: ''
  },
  //内容
  content: {
    type: String,
    default: ''
  },
  //评论此发言的评论
  replyComment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  meta: {
    likeCount: {
      type: Number,
      default: 0
    },
    likeUser: {
      type: Array,
      default: []
    }
  }
})

module.exports =  mongoose.model('Comment', CommentSchema)