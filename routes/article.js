/**
 * Created by linGo on 2018/1/7.
 */

//连接数据库
require('../mongodb/config/mongoose')

var express = require('express');
var router = express.Router();
var fs = require('fs')

var Article = require('../mongodb/model/article.model'),
    Comment = require('../mongodb/model/comment.model'),
    User = require('../mongodb/model/user.model');

var defaultSize = require('./config').defaultSize

//获取推荐文章
// url: /article/recommend_articles
// method: get
// params: size, last_date
router.get('/recommend_articles', function(req, res, next) {

})




//获取全部文章
// - url： /article/all_articles
// method： get
// params： size, last_date
router.get('/all_articles', function(req, res, next) {
  //查询数据库获取全部文章
  var size = req.param('size') || defaultSize,
      last_date = req.param('last_date') || '';

  if(!last_date){
    //直接查询
    Article.find()
        .sort( {buildTime: -1} ) // 降序排列获取最新的
        .limit(size)
        .exec( (err, articles) => {
          _helpSendList(res, err, articles,size)
        })
  }else{
    //上拉加载刷新
    Article.find({
      buildTime: { $lt: last_date}
    }).sort( {buildTime: -1} )
        .limit(size)
        .exec( (err, articles) => {
          _helpSendList(res, err, articles, size)
        })
  }
})

//文章详情
// url: /article/article_detail
// method: get
// params:id
router.get('/article_detail', function(req, res, next){
  var id = req.param('id');
  Article.findOne( {_id: id } )
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
  var id = req.query.id
  _helpLikeOrNot(req, res, 1, id)
})

//给文章取消点赞
// url: /article/dislike
// method: get
// params: id
router.get('/dislike', function(req, res, next){
  var id = req.query.id
  _helpLikeOrNot(req, res, -1, id)
})

//评论文章
// url: /article/write_comment
// method: post
// params: _id, content, uid
router.post('/write_comment', function(req, res, next){
  getUser(req.session.loginUser).then( user => {
    if(!user){
      return res.send({
        ret: -1,
        message: '请先登录'
      })
    }
    var id = req.body.id,
        content = req.body.content,
        uid = user._id;
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
        _id: id
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
 - url: /article/all_comment
 - method: get
 - params:
   - id //文章id
   - last_date: date
   - size: 10
*/
router.get('/all_comment', function(req, res, next){
  var id = req.param('id'),
      last_date = req.param('last_date') || '',
      size = req.param('size') || defaultSize

  var condition = { toArticleId: id};
  if(last_date){
    Object.assign(condition, {
      buildTime: {
        $lt: last_date
      }
    })
  }

  Comment.find(condition)
      .sort( {buildTime: -1})
      .limit(size)
      .exec( (err, comments) => {
        _helpSendList(res, err, comments, size)
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

//错误处理函数
function _dealWithError(){

}

//点赞辅助函数
function _helpLikeOrNot(req, res, type, id){
  var message, inc, option;
  if(type == 1){
    //表示点赞
    inc = 1
    message = '成功点赞'
    option = {
      $push: {
        loveArticle: id
      }
    }
  }else{
    //取消点赞
    inc = -1
    message = '成功取消点赞'
    option = {
      $pull: {
        loveArticle: id
      }
    }
  }
  User.findOneAndUpdate(
      {'username': req.session.loginUser},
      option
      ).exec(function(err, user){
        console.log(err)
        if(!user){
          return res.send({
            ret: -1,
            message: '请先登录'
          })
        }
        Article.update( {_id: id }, {$inc: {"meta.likeCount": inc}}, function(err, raw){
          if(err) {
            res.send({
              ret: 1,
              message: err
            })
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
    User.find({'username': username}, function(err, user){
      resolve(user);
    })
  })
}

module.exports = router;