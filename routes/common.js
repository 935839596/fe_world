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
   - uid
 */
router.get('/get_user', function(req, res, next){
  var id = req.query.id;
  User.findOne({'_id': id})
      .exec(function(err, user){
        return res.send({
          ret: 0,
          message: 'ok',
          data: {
            user: user
          }
        })
      })
})

/*
 获取发布的文章
 - url: /common/user_articles
 - method: get
 - params:
   - uid
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
   - uid
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
    uid
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

module.exports = router;