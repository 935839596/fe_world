/**
 * Created by linGo on 2018/3/12.
 */
//连接数据库
require('../mongodb/config/mongoose')

var User = require('../mongodb/model/user.model')
var Article = require('../mongodb/model/article.model')

var num = 0

  User.find()
    .exec((err, users) => {
      users.forEach(user => {
        var articles = user.article;
        getArray(articles).then(newArticles => {
         newArticles =  newArticles.filter( (gg) => typeof(gg)!='undefined')
          user.article = newArticles;
          user.save(function(err, user){
            // console.log(user)
            num++;
            console.log(num)
          })
        })
      })

    })

function getNewId(article){
  return new Promise(function(resolve,reject) {
     Article.findOne({id: article})
       .exec((err, article) => {
         if(article){
           resolve(article._id)
         }else{
           reject(-1)
         }
       })
  })
}

function getArray(articles) {
  return Promise.all( articles.map((article) => {
    return getNewId(article).then( newId => newId,()=>{console.log('wrong')})
  }))
}



/*
User.findOne({_id:'5a54a31dedca70143cf86486'})
  .exec((err, user) => {
    var articles = user.article;
    getArray(articles).then(newArticles => {
      user.article = newArticles;
      user.save(function(err, user){
        console.log(user)
      })
    })
  })*/
