var mongoose = require('mongoose')

var  User = require('../../mongodb/model/user.model');

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
  //讨论的种类，0代表自己发布，1代表评论别人的
  type: {
    type: Number,
    default: '0'
  },
  //如果是1，则不为空
  toDiscussionId: {
    type: String,
    default: ''
  },
  //评论此发言的评论
  replyComment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discussion'
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
