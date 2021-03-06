var mongoose = require('mongoose');
var md5 = require('md5')
var password = md5('123456')

var Article = require('./article.model'),
    User = require('./user.model')

var UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    default: Date.now()+''+Math.floor(Math.random()*100000000000)
  },
  tag: {
    type: Array,
    default: []
  },
  username: {
    type: String,
    default: '佚名',
    unique: true
  },
  password: {
    type: String,
    default: password
  },
  avatarLarge: {
    type: String,
    default: ''
  },
  //关注的人
  followees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  //粉丝
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  article:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  //我感兴趣的标签
  interest: {
    type:Array,
    default: []
  },
  loveArticle: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  intro: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  meta: {
    followeesCount: {
      type: Number,
      default:0
    },
    followersCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    }
  }

})

module.exports = mongoose.model( 'User', UserSchema)