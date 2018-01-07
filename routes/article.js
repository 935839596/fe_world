/**
 * Created by linGo on 2018/1/7.
 */

//连接数据库
// import {db} from '../mongodb/config/mongoose'
require('../mongodb/config/mongoose')

var express = require('express');
var router = express.Router();
var fs = require('fs')
// db()

var Article = require('../mongodb/model/article.model'),
    Comment = require('../mongodb/model/comment.model')

//获取推荐文章
// url: /article/recommend_articles
// method: get
// params: size, last_date
router.get('/recommend_articles', function(req, res, next) {

})




//获取全部文章
// - url： /article/all_article
// method： get
// params： size, last_date
router.get('/recommend_articles', function(req, res, next) {
  //查询数据库获取全部文章
  var size = req.param('size') || 10,
      last_date = req.param('last_date') || '';

  if(!last_date){
    //直接查询
    Article.find()
        .sort( {buildTime: -1} ) // 降序排列获取最新的
        .limit(size)
        .exec( (err, articles) => {
          _helpSendArticle(res, err, articles)
        })
  }else{
    //上拉加载刷新
    Article.find({
      buildTime: { $lt: last_date}
    }).sort( {buildTime: -1} )
        .limit(size)
        .exec( (err, articles) => {
          _helpSendArticle(res, err, articles)
        })
  }
})

//文章详情
// url: /article/article_detail
// method: get
// params:id
router.get('/article_detail', function(req, res, next){
  var id = req.param('id');
  Article.findOne( {id: id } )
      .exec( (err, article) => {
        if(err){
          _dealWithError
        }else{
          res.send({
            ret: 0,
            message: '',
            data: article
          })
        }
      })
})

//给文章点赞
// url: /article/like
// method: get
// params: id
router.get('/like', function(req, res, next){
  var id = req.param('id')
  _helpLikeOrNot(res, 1, id)
})

//给文章取消点赞
// url: /article/dislike
// method: get
// params: id
router.get('/dislike', function(req, res, next){
  var id = req.param('id')
  _helpLikeOrNot(res, -1, id)
})

//评论文章
// url: /article/write_comment
// method: post
// params: _id, content, uid
router.post('/write_comment', function(req, res, next){
  var id = req.body.id,
      content = req.body.content,
      uid = req.body._id;
  /*id = '5a3cccdb6fb9a04500034053'
  content = '你真棒'
  uid = '5a43938e51fb4902b0661510'*/

  //写入评论
  var comment = {
    author: uid,
    content: content,
    toArticleId: id
  }
  comment = new Comment(comment)
  comment.save(function (err, comment) {
    if(err){
      //TODO:错误处理
      return
    }
    Article.update({
      id: id
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

/*
 获取全部评论
 - url: /article/all_comment
 - method: get
 - params:
   - id //文章id
   - last_date: date
   - size: 10
*/
router.get('/all_comment', function(req, res, next){
  var id = req.param('id'),
      last_date = req.param('date') || '',
      size = req.param('size') || 5

  var condition = { toArticleId: id};
  if(last_date){
    Object.assign(condition, {
      buildTime: {
        $lt: last_date
      }
    })
  }

  Comment.find(condition)
      .sort( {pubTime: -1})
      .limit(size)
      .exec( (err, comments) => {
        _helpSendComment(res, err, comments)
      })


})


//辅助函数
function _helpSendArticle(res, err ,articles){
  if(err){
    //TODO: 错误处理
    return res.send({
      ret: 1,
      message: '网络故障'
    })
  }else{
    var more = true;
    if(!articles || articles.length === 0 || articles.length < 10)
      more = false
    res.send({
      more: more,
      last_date: more? articles[articles.length-1].buildTime : '',
      article_list: articles
    })
  }
}

function _helpSendComment(res, err ,comments){
  if(err){
    //TODO: 错误处理
    return res.send({
      ret: 1,
      message: '网络故障'
    })
  }else{
    var more = true;
    if(!comments || comments.length === 0 || comments.length < 10)
      more = false
    res.send({
      more: more,
      last_date: more? comments[comments.length-1].buildTime : '',
      comment_list: comments
    })
  }
}

//错误处理函数
function _dealWithError(){

}

//点赞辅助函数
function _helpLikeOrNot(res, type, id){
    var message, inc;
    if(type == 1){
      //表示点赞
      inc = 1
      message = '成功点赞'
    }else{
      //取消点赞
      inc = -1
      message = '成功取消点赞'
    }
    Article.update( {id: id }, {$inc: {"meta.likeCount": inc}}, function(err, raw){
      if(err) {

      }else{
        res.send({
          ret: 0,
          message: message
        })
      }
    })
}




module.exports = router;