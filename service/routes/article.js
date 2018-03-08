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
  getUser(req.session.loginUser).then( user => {
    //查询数据库获取全部文章
    var size = req.query.size || defaultSize,
      last_date = req.query.last_date || '';

    if(!last_date || last_date === 'undefined'){
      //直接查询
      console.log('here')
      Article.find()
        .sort( {buildTime: -1} ) // 降序排列获取最新的
        .limit(size)
        .populate({
          path: 'author',
        })
        .exec( (err, articles) => {
          if(user){
            articles = articles.map( article => {
              if(user.loveArticle.indexOf(article._id) >= 0){
                return Object.assign(article._doc, {
                  like: true
                })
              }else{
                return Object.assign(article._doc, {
                  like: false
                })
              }
            })
          }
          _helpSendList(res, err, articles,size)
        })
    }else{
      //上拉加载刷新
      Article.find({
        buildTime: { $lt: last_date}
      }).sort( {buildTime: -1} )
        .limit(size)
        .populate({
          path: 'author',
        })
        .exec( (err, articles) => {
          if(user){
            articles =  articles.map( article => {
              if(user.loveArticle.indexOf(article._id) >= 0){
                return Object.assign(article._doc, {
                  like: true
                })
              }else{
                return Object.assign(article._doc, {
                  like: false
                })
              }
            })
          }
          _helpSendList(res, err, articles, size)
        })
    }
  })
})

//文章详情
// url: /article/article_detail
// method: get
// params:id
router.get('/article_detail', function(req, res, next){
  var id = req.param('id');
  Article.findOne( {_id: id } )
    .populate({
      path: 'author'
    })
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

router.get('/articleHTML', function(req, res, next){
  var id = req.query.id;
  Article.findOne( {_id: id } )
    .populate({
      path: 'author'
    })
    .exec( (err, article) => {
      if(err){
        _dealWithError
      }else{
        res.setHeader('Content-Type', 'text/html');
        res.render('./article/articleTem.ejs', {
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



/*
 给评论点赞
 - url: /article/comment_like
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
 - url: /article/comment_dislike
 - method: get
 - params:
    - id
 */
router.get('/comment_dislike', function(req, res, next){
  var commentId = req.query.id
  _commentHelpLikeOrNot(req, res, -1, commentId)
})

/*评论文章
url: /article/write_comment
method: post
params:
  articleId,
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
    var articleId = req.body.articleId,
        toCommentId = req.body.toCommentId,
        toSecCommentId = req.body.toSecCommentId,
        content = req.body.content,
        type = req.body.type,
        uid = user._id;

    console.log(articleId, toCommentId, toSecCommentId, content, type ,uid)

    //写入评论
    var comment = {
      author: uid,
      content: content,
      toArticleId: articleId,
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
      Article.update({
        _id: articleId
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
  getUser(req.session.loginUser).then( user => {
    var id = req.param('id'),
      last_date = req.param('last_date') || '',
      size = req.param('size') || defaultSize

    var condition = { toArticleId: id, type: 0};
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
 - url: /article/sec_comment
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


/*
  获取全部评论数
   url: /article/all_comment_count
   method: get
   params:
     id: 文章id
 */
router.get('/all_comment_count', function(req, res, next){
  Comment.find({
    toArticleId: req.query.id
  }).exec( (err, comments) => {
    if(err){
      return
    }
    console.log('count', comments.length)
    res.send({
      ret: 0,
      data: comments.length
    })
  })
})

/*
  获取详细评论
  url: /article/comment_detail
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
             return res.send({
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
      resolve(user);
    })
  })
}

module.exports = router;