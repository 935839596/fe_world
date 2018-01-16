//连接数据库
require('../mongodb/config/mongoose')

var express = require('express');
var router = express.Router();
var fs = require('fs')

var Discussion = require('../mongodb/model/discussion.model')

/*
  获取讨论列表
  - url: /discussion/all_discussion
  - method: get
  - params:
    - last_date: date
    - size: 10
 */
router.get('/all_discussion', function (req, res, next) {
  var size = req.param('size') || 10,
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
      .exec( (err, discussions)=> {
        if(err){
          return res.send({
            code: 1,
            message: ''
          })
        }

        var more = true;
        if(!discussions || discussions.length === 0 || discussions.length < size)
          more = false
        res.send({
          more: more,
          last_date: more? discussions[discussions.length-1].buildTime : '',
          article_list: discussions
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
  var content = req.body.content;
  // content = '发言内容啥地方卡见识到了放假爱上了对方'
  var discussion = {
    author: '5a43938e51fb4902b0661510',
    content: content,
    type: 0
  }
  discussion = new Discussion(discussion);
  discussion.save(function (err, discussion){
    if(err){
      //TODO:错误处理
      return
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

/*
 评论发言
 - url：/discussion/write_comment
 - method: post
 - params:
   - discussionId: 1512,
   - content: ''
   - type: 0 //0代表自己发布，1代表评论别人的
   - toDiscussionId: //如果是1的话就需要这个字段
 */
router.post('/write_comment', function (req, res, next) {
  var content = req.body.content,
      toDiscussionId = req.body.toDiscussionId;

  /*content = '2'
  toDiscussionId = '5a5aec26e302961f7c2ad391'*/

  var discussion = new Discussion({
    author: '5a43938e51fb4902b066150e',
    content: content,
    type: 1,
    toDiscussionId: toDiscussionId
  })

  discussion.save(function (err, discussion) {
    if(err){
      //TODO: 错误处理
      return
    }else{
      Discussion.update({
        _id: toDiscussionId,
      },{
        $push: {
          replyComment: discussion._id
        }
      }, err => {
        if(err){
          //TODO:错误处理
          return
        }else{
          res.send({
            ret: 0,
            message: '评论成功',
            data: {
              discussion: discussion
            }
          })
        }
      })
    }
  })

})

/*
 获取讨论的评论列表
 - url: /discussion/all_discussion_comment
 - method: get
 - params:
   - discussionId: 1512
   - last_date:  date
   - size: 8
 */

router.get('/all_discussion_comment', function (req, res, next) {
  var discussionId = req.param('discussionId'),
      last_date = req.param('last_date') || '',
      size = req.param('size') || 2;

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
  Discussion.findOne({ _id: discussionId })
      .populate({
        path: 'replyComment',
        match: condition,
        options: option
      }).exec( (err, discussions) => {
        _helpSendList(res, err, discussions.replyComment, size)
      })
})

/*
  点赞
- url: /discussion/like
- method: post
- params:
  - discussionId
 */
router.get('/discussion/like', function(req, res, next){
  var discussionid = req.body.discussionId


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

module.exports = router;