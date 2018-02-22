var express = require('express');
var router = express.Router();

//连接数据库
require('../mongodb/config/mongoose')

var User = require('../mongodb/model/user.model'),
    Message = require('../mongodb/model/message.model'),
    Article = require('../mongodb/model/article.model')

var defaultSize = require('./config').defaultSize

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/me', function(req, res, next){
  getUser(req,res).then(user=>{
    return res.send({
      ret: 0,
      username: req.session.loginUser,
      userId: req.session.loginUserId,
      user: user
    })
  })
})

/*
 获取头像
 - url: /my/avatar
 - method: get
 - params
 */
router.get('/avatar', function(req, res, next){
  var username = req.session.loginUser;
  User.findOne({'username': username}, function(err, user){
    if(err){
      return res.send({
        ret: 1,
        message: '获取头像失败'
      })
    }
    return res.send({
      ret: 1,
      message: 'success',
      data: {
        avatar: user.avatarLarge
      }
    })
  })
})

/*
 查看消息列表
 - url: /my/all_message
 - method: get
 - params
    - last_date: date,
    - size: 10
 */
router.get('/all_message', function(req, res, next) {
  var last_date = req.param('last_date') || '',
      size = req.param('size') || defaultSize;

  getUser(req, res).then( user => {
    if(!user){

    }


    var condition = {
      toUser: user._id,
      read: false
    }

    if(last_date){
      Object.assign(condition, {
        buildTime: {
          $lt: last_date
        }
      })
    }

    Message.find(condition)
        .sort( {buildTime: -1})
        .limit(size)
        .exec( (err, messages) => {
          _helpSendList(res, err, messages, size)
        })
  })
})

/*
 我喜欢的文章
 - url: /my/like_articles
 - method: get
 - params
   - last_date: date
   - size: 10
 */
router.get('/like_articles', function(req, res, next){
  var last_date = req.param('last_date') || '',
      size = req.param('size') || defaultSize;

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

  User.findOne({'username': req.session.loginUser})
      .populate({
        path: 'loveArticle',
        match: condition,
        options: option
      }).exec( (err, user) => {
        _helpSendList(res, err, user.loveArticle, size)
      })
})

/*
 我关注的标签
 - url: /my/interest
 - method: get
 - params
 - response
 */
router.get('/interest', function(req, res, next){
  getUser(req, res).then( user => {
    res.send({
      ret: 0,
      message: 'success',
      list: user.interest
    })
  })
})

/*
 编辑资料
 - url: /my/modify_description
 - method: post
 - params
   - intro
   - company
 */
router.get('/modify_description', function(req, res, next){
  var intro = req.body.intro,
      company = req.body.company;

  User.findOneAndUpdate(
      {'username': req.session.loginUser},
      {
        'intro': intro,
        'company': company
      }
  ).exec(function(err, user){
    if(!user){
      return res.send({
        ret: -1,
        message: '请先登录'
      })
    }
    if(err){
      return res.send({
        ret: 1,
        message: '修改失败，请重试'
      })
    }

    return res.send({
      ret: 0,
      message: 'ok'
    })
  })
})

/*
 关注标签
 - url: /common/add_interest
 - method: post
 - params:
 - tag: 'vue'
 */
router.post('/add_interest', function(req, res, next){
  var tag = req.body.tag;
  getUser(req, res).then( user => {
    var newTag = user.interest.concat(tag);
    newTag = [...new Set(newTag)]
    user.set('interest', newTag)

    user.save(function (err, newUser) {
      if(err){
        return res.send({
          ret: 1,
          message: '关注失败'
        })
      }
      return res.send({
        ret: 0,
        message: 'ok'
      })
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
