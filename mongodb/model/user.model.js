var mongoose = require('mongoose');
var md5 = require('md5')
var password = md5('123456')

var UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    unique: true
  },
  tag: {
    type: Array,
    default: []
  },
  username: {
    type: String,
    default: '佚名'
  },
  password: {
    type: String,
    default: password
  },
  avatarLarge: {
    type: String,
    default: 'https://suibian.com'
  },
  followees: {
    type: Array,
    default: []
  },
  followers: {
    type: Array,
    default: []
  },
  article:{
    type: Array,
    default: []
  },
  //我感兴趣的标签
  interest: {
    type:Array,
    default: []
  },
  loveArticle: {
    type: Array,
    default: []
  },
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