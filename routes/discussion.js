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
router.get('/discussion/all_discussion', function (req, res, next) {
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

  Article.find(condition)
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
router.post('/discussion/write_discussion', function (req, res, next) {
  var content = req.body.content;
  var discussion = {
    author: '5a4b76338b69bb25d83da3c6',
    content: content,
    type: 0
  }
  discussion = new Discussion(discussion);
  discussion.save(function (err, discussion){
    if(err){
      //TODO:错误处理
      return
    }

  })
})