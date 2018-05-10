var express = require('express');
var router = express.Router();

//连接数据库
require('../mongodb/config/mongoose')

var User = require('../mongodb/model/user.model'),
    Message = require('../mongodb/model/message.model'),
    Article = require('../mongodb/model/article.model'),
    Tag = require('../mongodb/model/tag.model')

var defaultSize = require('./config').defaultSize

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/me', function(req, res, next){
  getUser(req.session.loginUser).then(user=>{
    return res.send({
      ret: 0,
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

  getUser(req.session.loginUser).then( user => {
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
  getUser(req.session.loginUser).then( user => {
    if(!user){
      return res.send({
        ret: -1,
        message: '请先登录'
      })
    }
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
   - type 1-intro 2-company
 */
router.post('/modify_description', function(req, res, next){
  var intro = req.body.intro,
      company = req.body.company,
    type = req.body.type;

  var condition;
  if(type == 1){
    condition = {'intro': intro}
  }else if(type == 2){
    condition = {'company': company}
  }
  User.findOneAndUpdate(
      {'username': req.session.loginUser},
      condition
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
* 修改头像
* url: /my/modify_avatarLarge
* method: post
* params
*   avatarLarge
* */
router.post('/modify_avatarLarge', function(req, res, next){
  var avatarLarge = req.body.avatarLarge;

  User.findOneAndUpdate(
    {'username': req.session.loginUser},
    {'avatarLarge': avatarLarge}
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
 添加关注的标签
 - url: /my/add_interest
 - method: post
 - params:
 - tag: 'vue'
 */
router.post('/add_interest', function(req, res, next){
  var tag = req.body.tag;
  getUser(req.session.loginUser).then( user => {
    if(!user){
      return res.send({
        ret: -1,
        message: '请先登录'
      })
    }

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
      Tag.update({tagName: tag},{$push: {fans: user._id}}, function(err, af){
        if(err){
          return res.send({
            ret: 1,
            message: '关注失败'
          })
        }
        return res.send({
          ret: 0,
          message: '关注成功'
        })
      })

    })
  })
})

/*
 初始化感兴趣的标签
 - url: /my/init_interest
 - method: post
 - params:
 - tag: array
 */
router.post('/init_interest', function(req, res, next){
  var tag = req.body.tag;
  getUser(req.session.loginUser).then( user => {
    if(!user){
      return res.send({
        ret: -1,
        message: '请先登录'
      })
    }

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

      saveTagAll(newTag, newUser._id).then( ret => {
        return res.send({
          ret: 0,
          message: 'ok'
        })
      })

    })
  })
})

function saveTagOne(tag, userId){
  return new Promise(function(resolve, reject) {
    Tag.update({tagName: tag},{$push: {fans: userId}},function(err){
      resolve(1)
    })
  })
}

function saveTagAll(tags,userId){
  return Promise.all( tags.map(tag => {
    return saveTagOne(tag,userId).then(ret=>ret)
  }) )
}

/*
 删除标签
 - url: /my/remove_interest
 - method: post
 - params:
 - tag: 'vue'
 */
router.post('/remove_interest', function(req, res, next){
  var tag = req.body.tag;
  getUser(req.session.loginUser).then( user => {
    if(!user){
      return res.send({
        ret: -1,
        message: '请先登录'
      })
    }

    var index = user.interest.indexOf(tag)
    user.interest.splice(index, 1);
    var newTag = user.interest;
    newTag = [...new Set(newTag)]
    user.set('interest', newTag)

    user.save(function (err, newUser) {
      if(err){
        return res.send({
          ret: 1,
          message: '关注失败'
        })
      }
      Tag.update({tagName: tag},{$pull: {fans: newUser._id}},function(err){
        return res.send({
          ret: 0,
          message: 'ok'
        })
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

function getUser(name){
  return new Promise(function(resolve,reject){
    User.findOne({'username': name}, function(err, user){
      resolve(user);
    })
  })
}

module.exports = router;
