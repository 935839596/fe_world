//连接数据库
require('../mongodb/config/mongoose')

var express = require('express');
var router = express.Router();
var fs = require('fs')

var Discussion = require('../mongodb/model/discussion.model'),
  User = require('../mongodb/model/user.model'),
  Comment = require('../mongodb/model/comment.model')

var defaultSize = require('./config').defaultSize

/*
  获取讨论列表
  - url: /discussion/all_discussion
  - method: get
  - params:
    - last_date: date
    - size: 10
 */
router.get('/all_discussion', function (req, res, next) {
  getUser(req.session.loginUser).then( user => {
    var size = req.param('size') || defaultSize,
      last_date = req.param('last_date') || '';

    var condition = {};
    if(last_date){
      Object.assign(condition, {
        buildTime: {
          $lt: last_date
        }
      })
    }

    Discussion.find(condition)
      .sort( {buildTime: -1} )
      .limit(size)
      .populate({
        path: 'author'
      })
      .exec( (err, discussions)=> {
        if(err){
          return res.send({
            code: 1,
            message: ''
          })
        }

        if(user){
         discussions =  discussions.map( discussion => {
           var newDiscussion;
           //是否点赞
            if(discussion.meta.likeUser.indexOf(user._id) >= 0){
              newDiscussion = Object.assign(discussion._doc, {
                like: true
              })
            }else{
              newDiscussion = Object.assign(discussion._doc, {
                like: false
              })
            }

            //是否关注作者
            if(discussion.author.followers && discussion.author.followers.length > 0 && discussion.author.followers.indexOf(user._id) >= 0){
              newDiscussion = Object.assign(newDiscussion,{
                following: true
              })
            }else{
              newDiscussion = Object.assign(newDiscussion,{
                following: false
              })
            }

            //是否自己
           if(discussion.author._id.toString() == user._id.toString()){
             newDiscussion = Object.assign(newDiscussion,{
               self: true
             })
           }else{
             newDiscussion = Object.assign(newDiscussion,{
               self: false
             })
           }

            return newDiscussion;
          })
        }

        var more = true;
        if(!discussions || discussions.length === 0 || discussions.length < size)
          more = false
        _helpSendList(res,err, discussions, size)
      })
  })

})

//TODO:从session获取登录的用户
/*
  发言
  - url：/discussion/write_discussion
  - method: post
  - params:
    - content: ''
 */
router.post('/write_discussion', function (req, res, next) {
  var content = req.body.content,
    image = req.body.image
  // content = '发言内容啥地方卡见识到了放假爱上了对方'

  if(!req.session.loginUserId){
    return res.send({
      ret: -1,
      message: '请先登录'
    })
  }

  var discussion = {
    author: req.session.loginUserId,
    content: content,
    type: 0,
    buildTime: Date.now(),
    imageCache: image
  }
  discussion = new Discussion(discussion);
  discussion.save(function (err, discussion){
    if(err){
      return res.send({
        ret: 1,
        message: 'wrong'
      })
    }
    else{
      res.send({
        ret: 0,
        message: '发言成功',
        data: {
          discussion: discussion
        }
      })
    }
  })
})


/*评论发言
 url: /discussion/write_comment
 method: post
 params:
 discussionId,
 toCommentId,
 toSecCommentId,
 type
 content,
 */
router.post('/write_comment', function(req, res, next){
  getUser(req.session.loginUser).then( user => {
    if(!user){
      return res.send({
        ret: -1,
        message: '请先登录'
      })
    }
    var discussionId = req.body.discussionId,
      toCommentId = req.body.toCommentId,
      toSecCommentId = req.body.toSecCommentId,
      content = req.body.content,
      type = req.body.type,
      uid = user._id;

    console.log(discussionId, toCommentId, toSecCommentId, content, type ,uid)

    //写入评论
    var comment = {
      author: uid,
      content: content,
      toDiscussionId: discussionId,
      buildTime: Date.now(),
      type: type
    }
    if(type === 1){
      Object.assign(comment, {
        toCommentId: toCommentId
      })
    }else if(type === 2){
      Object.assign(comment, {
        toCommentId: toCommentId,
        toSecCommentId: toSecCommentId
      })
    }
    comment = new Comment(comment)
    comment.save(function (err, comment) {
      if(err){
        //TODO:错误处理
        return
      }
      Discussion.update({
        _id: discussionId
      }, {
        $push: {
          comment: comment._id
        }
      }, (err) => {
        if(err){
          //TODO:错误处理
          return
        }
        res.send({
          ret: 0,
          message: '评论成功'
        })
      })
    })
  })
})

/*
 获取全部评论
 - url: /discussion/all_comment
 - method: get
 - params:
   - id: 1512
   - last_date:  date
   - size: 8
 */
router.get('/all_comment', function (req, res, next) {
  getUser(req.session.loginUser).then( user => {
    var id = req.param('id'),
      last_date = req.param('last_date') || '',
      size = req.param('size') || defaultSize;

    var condition = {toDiscussionId: id, type: 0};
    if(last_date){
      Object.assign(condition, {
        buildTime: {
          $lt: last_date
        }
      })
    }

    Comment.find(condition)
      .sort( {buildTime: -1})
      // .limit(size)
      .populate({
        path: 'author'
      })
      .exec( (err, comments) => {
        if(err){
          return res.send({
            code: 1,
            message: ''
          })
        }

        if(user){
          comments = comments.map( comment => {
            if(comment.meta.likeUser.indexOf(user._id) >= 0){
              return Object.assign(comment._doc, {
                like: true
              })
            }else{
              return Object.assign(comment._doc, {
                like: false
              })
            }
          })
        }

        _helpSendList(res, err, comments, size)
      })
  })
})

/*
 获取二级评论
 - url: /discussion/sec_comment
 - method: get
 - params:
 - id //一级评论的id
 */
router.get('/sec_comment', function(req, res, next){
  getUser(req.session.loginUser).then( user => {
    var id = req.param('id'),
      last_date = req.param('last_date') || '',
      size = req.param('size') || defaultSize

    var condition = { toCommentId: id};
    if(last_date){
      Object.assign(condition, {
        buildTime: {
          $lt: last_date
        }
      })
    }

    Comment.find(condition)
      .sort( {buildTime: -1})
      // .limit(size)
      .populate({
        path: 'author'
      })
      .exec( (err, comments) => {
        if(err){
          return res.send({
            code: 1,
            message: ''
          })
        }

        if(user){
          comments = comments.map( comment => {
            if(comment.meta.likeUser.indexOf(user._id) >= 0){
              return Object.assign(comment._doc, {
                like: true
              })
            }else{
              return Object.assign(comment._doc, {
                like: false
              })
            }
          })
        }

        _helpSendList(res, err, comments, size)
      })
  })
})

//文章详情
// url: /discussion/discussion_detail
// method: get
// params:id
router.get('/discussion_detail', function(req, res, next){
  getUser(req.session.loginUser).then( user => {
    var id = req.query.id;
    Discussion.findOne( {_id: id } )
      .populate({
        path: 'author'
      })
      .exec( (err, discussion) => {
        if(err){

        }else{

          if(user){
            if(discussion.author.followers && discussion.author.followers.length > 0 && discussion.author.followers.indexOf(user._id) >= 0) {
              discussion = Object.assign(discussion._doc, {following: true})
            }else{
              discussion = Object.assign(discussion._doc, {following: false})
            }

            if(discussion.author._id.toString() == user._id.toString()){
              discussion = Object.assign(discussion, {self: true})
            }else{
              discussion = Object.assign(discussion, {self: false})
            }
          }

          res.send({
            ret: 0,
            message: '',
            data: discussion
          })
        }
      })
  })
})

/*
 获取全部评论数
 url: /discussion/all_comment_count
 method: get
 params:
 id: 文章id
 */
router.get('/all_comment_count', function(req, res, next){
  Comment.find({
    toDiscussionId: req.query.id
  }).exec( (err, comments) => {
    if(err){
      return
    }
    res.send({
      ret: 0,
      data: comments.length
    })
  })
})

/*
 获取详细评论
 url: /discussion/comment_detail
 method: get
 params:
 id: 评论id
 */
router.get('/comment_detail', function(req, res, next){
  Comment.findOne({
    _id: req.query.id
  }).populate({
    path: 'author'
  })
    .exec( (err, comment) => {
      if(err) return

      res.send({
        ret: 0,
        data: comment
      })
    })
})

/*
  点赞
- url: /discussion/like
- method: get
- params:
  - id
 */
router.get('/like', function(req, res, next){
  var discussionid = req.query.id
  _helpLikeOrNot(req, res, 1, discussionid)
})

/*
 取消点赞
 - url: /discussion/dislike
 - method: get
 - params:
 - id
 */
router.get('/dislike', function(req, res, next){
  var discussionid = req.query.id
  _helpLikeOrNot(req, res, -1, discussionid)
})

/*
 给评论点赞
 - url: /discussion/comment_like
 - method: get
 - params:
 - id
 */
router.get('/comment_like', function(req, res, next){
  var commentId = req.query.id
  _commentHelpLikeOrNot(req, res, 1, commentId)
})

/*
 给评论取消点赞
 - url: /discussion/comment_dislike
 - method: get
 - params:
 - id
 */
router.get('/comment_dislike', function(req, res, next){
  var commentId = req.query.id
  _commentHelpLikeOrNot(req, res, -1, commentId)
})

function _helpSendList(res, err, list, size){
  if(err){
    //TODO:错误处理
    return
  }else{
    var more = true;
    if(!list || list.length === 0 || list.length < size)
      more = false
    res.send({
      ret: 0,
      message: '',
      data: {
        more: more,
        last_date: more? list[list.length-1].buildTime : '',
        list: list
      }
    })
  }
}

//点赞辅助函数
function _helpLikeOrNot(req, res, type, id){
  var message, inc, option = {};
  if(type == 1){
    //表示点赞
    inc = 1
    message = '成功点赞'
    option = Object.assign(option, {
      $push: {
        'meta.likeUser': req.session.loginUserId
      }
    })
  }else{
    //取消点赞
    inc = -1
    message = '成功取消点赞'
    option = Object.assign(option, {
      $pull: {
        'meta.likeUser': req.session.loginUserId
      }
    })
  }
  option = Object.assign(option,{$inc: {"meta.likeCount": inc}})

  Discussion.update( {_id: id }, option , function(err, raw){
    if(err) {

    }else{
      res.send({
        ret: 0,
        message: message
      })
    }
  })
}

//评论点赞辅助函数
function _commentHelpLikeOrNot(req, res, type, id){
  getUser(req.session.loginUser).then(user => {
    if(!user){
      return res.send({
        ret: -1,
        message: '请先登录'
      })
    }

    var message, inc, option = {};
    if(type == 1){
      //表示点赞
      inc = 1
      message = '成功点赞'
      option = Object.assign(option, {
        $push: {
          'meta.likeUser': user._id
        }
      })
    }else{
      //取消点赞
      inc = -1
      message = '成功取消点赞'
      option = Object.assign(option, {
        $pull: {
          'meta.likeUser': user._id
        }
      })
    }
    option = Object.assign(option,{$inc: {"meta.likeCount": inc}})

    Comment.update( {_id: id }, option , function(err, raw){
      if(err) {

      }else{
        res.send({
          ret: 0,
          message: message
        })
      }
    })
  })
}

function getUser(username){
  return new Promise(function(resolve,reject){
    User.findOne({'username': username}, function(err, user){
      console.log('user:', username)
      resolve(user);
    })
  })
}

module.exports = router;