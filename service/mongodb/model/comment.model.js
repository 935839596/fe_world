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
  buildTime: {
    type: String,
    default: Date.now()
  },
  //评论的种类，0代表评论文章的，1代表评论别人的评论, 2代表回复别人的评论
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
  //如果是2，则不为空（对一级评论的回复）
  toSecCommentId: {

  },

  //内容
  content: {
    type: String,
    default: ''
  },
  //评论此发言的评论
  //废弃2018.3.6
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