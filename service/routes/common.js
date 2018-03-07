/**
 * Created by linGo on 2018/1/31.
 */

var express = require('express');
var router = express.Router();

//连接数据库
require('../mongodb/config/mongoose')
var defaultSize = require('./config').defaultSize

var User = require('../mongodb/model/user.model'),
    Message = require('../mongodb/model/message.model'),
    Article = require('../mongodb/model/article.model');

/*
 获取用户资料
 - url: /common/get_user
 - method: get
 - params:
   - id
 */
router.get('/get_user', function(req, res, next){
  var id = req.query.id;
  User.findOne({'_id': id})
      .exec(function(err, user){
        var following = false;
        if(user.followees.indexOf(req.session.loginUserId)>=0){
          following = true;
        }
        return res.send({
          ret: 0,
          message: 'ok',
          data: {
            user: user,
            following: following
          }
        })
      })
})

/*
 获取发布的文章
 - url: /common/user_articles
 - method: get
 - params:
   - id
   - last_date: date,
   - size: 10
 */
router.get('/user_articles', function (req, res, next) {
  var last_date = req.query.last_date || '',
      size = req.query.size || defaultSize,
      uid = req.query.id;

  var condition = {author: uid};
  if(last_date){
    Object.assign(condition, {
      buildTime: {
        $lt: last_date
      }
    })
  }

  Article.find(condition)
      .sort( {buildTime: -1})
      .limit(size)
      .exec( (err, articles) => {
        _helpSendList(res, err, articles, size)
      })
})

/*
 喜欢的文章
 - url: /common/like_articles
 - method: get
 - params
   - id
   - last_date: date,
   - size: 10
 */
router.get('/like_articles', function(req, res, next){
  var last_date = req.param('last_date') || '',
      size = req.param('size') || defaultSize,
      uid = req.query.id;

  var condition = {};
  if(last_date){
    Object.assign(condition, {
      buildTime: {
        $lt: last_date
      }
    })
  }

  var option = {
    sort: {'buildTime': -1},
    limit: size
  }

  User.findOne({'_id': uid})
      .populate({
        path: 'loveArticle',
        match: condition,
        options: option
      }).exec( (err, user) => {
        _helpSendList(res, err, user.loveArticle, size)
  })
})

/*
 关注的标签
 - url: /common/interest
 - method: get
 - prams
    id
 */
router.get('/interest', function (req, res, next) {
  User.findOne({'_id': req.query.id}, function(err, user){
    res.send({
      ret: 0,
      message: 'ok',
      list: user.interest
    })
  })
})

/*
 关注用户
 - url: /common/add_follow_user
 - method: get
 - params:
  - id
 */
router.get('/add_follow_user', function(req, res, next){
  var id = req.query.id;
  if(!req.session.loginUser){
    return res.send({
      ret: -1,
      message: '请先登录'
    })
  }
  _helpFollowOrNot(req, res, 1, id)
})

/*
 取消关注用户
 - url: /common/cancel_follow_user
 - method: get
 - params:
 - id
 */
router.get('/cancel_follow_user', function(req, res, next){
  var id = req.query.id;
  if(!req.session.loginUser){
    return res.send({
      ret: -1,
      message: '请先登录'
    })
  }
  _helpFollowOrNot(req, res, -1, id)
})

/*
 查看关注的人
 - url: /common/followees
 - method: get
 - params:
   - id
 */
router.get('/followees', function(req, res, next) {
  var id = req.query.id;
  getUser(req, res).then( loginUser => {
    User.findOne({'_id': id})
      .populate({
        path: 'followees'
      }).exec( (err, user) => {
      if(err){
        return res.send({
          ret: 1,
          message: '查询失败，请重试'
        })
      }

      if(loginUser) {
        var userFollowees = user.followees.map( followee => {
          if(loginUser.followees.indexOf(followee._id) >= 0) {
            return Object.assign( followee._doc, {
              following: true
            })
          }else {
            var newUser = Object.assign( followee._doc, {
              following: false
            })
            return newUser
          }
        })
      }else{
        var userFollowees = user.followees;
      }
      res.send({
        ret: 0,
        message: 'ok',
        list: userFollowees
      })
    })
  })
})

/*
 查看粉丝
 - url: /common/followers
 - method: get
 - params:
  - id
 */
router.get('/followers', function(req, res, next) {
  var id = req.query.id
  getUser(req, res).then( loginUser => {
    User.findOne({'_id': id})
      .populate({
        path: 'followers'
      }).exec( (err, user) => {
      if(err){
        return res.send({
          ret: 1,
          message: '查询失败，请重试'
        })
      }

      if(loginUser) {
        var userFollowers = user.followers.map( follower => {
          if(loginUser.followees.indexOf(follower._id) >= 0) {
            return Object.assign( follower._doc, {
              following: true
            })
          }else {
            var newUser = Object.assign( follower._doc, {
              following: false
            })
            return newUser
          }
        })
      }else{
        var userFollowers = user.followers;
      }
      res.send({
        ret: 0,
        message: 'ok',
        list: userFollowers
      })
    })
  })
})

/*
 查看全部标签
 - url: /common/all_tags
 - method: get
 */
router.get('/all_tags', function(req, res, next){
  res.send({
    ret: 0,
    message: 'ok',
    list: [
        'vue',
        'angular',
        'html',
        'node',
        'less',
        'css'
    ]
  })
})


//辅助函数
function _helpSendList(res, err ,list, size){
  if(err){
    //TODO: 错误处理
    return res.send({
      ret: 1,
      message: '网络故障'
    })
  }else{
    var more = true;
    if(!list || list.length === 0 || list.length < size)
      more = false
    res.send({
      ret: 0,
      message: 'success',
      data: {
        more: more,
        last_date: more? list[list.length-1].buildTime : '',
        list: list
      }
    })
  }
}



function getUser(req, res){
  return new Promise(function(resolve,reject){
    User.findOne({'username': req.session.loginUser}, function(err, user){
      if(!user){
        return res.send({
          ret: -1,
          message: '请先登录'
        })
      }
      resolve(user);
    })
  })
}

function _helpFollowOrNot(req, res, type, id){
  var message, inc,
      option1 = {},  //关注方;
      option2 = {} //被关注方
  if(type == 1){
    //表示关注
    inc = 1
    message = '关注成功'
    option1 = Object.assign(option1, {
      $push: {
        followees: id
      }
    })
    option2 = Object.assign(option2, {
      $push: {
        followers: req.session.loginUserId
      }
    })
  }else {
    //取消关注
    inc = -1
    message = '取消关注成功'
    option1 = Object.assign(option1, {
      $pull: {
        followees: id
      }
    })
    option2 = Object.assign(option2, {
      $pull: {
        followers: req.session.loginUserId
      }
    })
  }
  option1 = Object.assign(option1, {
    $inc: { 'meta.followeesCount': inc}
  })
  option2 = Object.assign(option2, {
    $inc: { 'meta.followersCount': inc}
  })

  User.update( {_id: req.session.loginUserId}, option1, function(err){
    if(err){
      return res.send({
        ret: 1,
        message: '关注失败，请重试'
      })
    }else{
      User.update({_id: id}, option2, function(err){
        if(err){
          return res.send({
            ret: 1,
            message: '关注失败，请重试'
          })
        }else{
          return res.send({
            ret: 0,
            message: message
          })
        }
      })
    }

  })

}

module.exports = router;