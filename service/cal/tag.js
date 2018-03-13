/**
 * Created by linGo on 2018/3/11.
 */
//连接数据库
require('../mongodb/config/mongoose')

var Article = require('../mongodb/model/article.model')

 Article.find()
 .exec((err, articles) => {
  var result = [];
  articles.forEach( article => {
    result = result.concat(article.tag)
    result = [...new Set(result)]
  })
   console.log(result)
 })