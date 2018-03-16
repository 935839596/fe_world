/**
 * Created by linGo on 2018/3/11.
 */
//连接数据库
require('../mongodb/config/mongoose')

var Article = require('../mongodb/model/article.model')
var Tag = require('../mongodb/model/tag.model')
var User = require('../mongodb/model/user.model')

 var tagName = ['vue', 'node', 'webpack', 'javascript', 'css', 'less', 'sass', 'Ecmascript6', 'jquery', 'angular', '设计模式',
   'express', 'koa', 'npm', 'axios', 'ajax', 'html', 'mongodb', 'dns', 'https', 'html'
 ]



/*Article.find()
  .exec( (err, articles) =>{
    articles.forEach( article => {
      article.tag.forEach( tag => {
        var arr = json[tag]
        if(!arr) arr = []
        arr.push(article._id)
        json[tag] = arr
      })
    })
   var tags = Object.keys(json);
    tags.sort((tag1, tag2) => {
      return json[tag2].length-json[tag1].length
    })
    console.log(json['前端'].length, json['JavaScript'].length, json['Vue.js'].length, json['React.js'].length)
    tags = tags.slice(0, 50)


    tags.forEach( label => {
      var tag = {
        tagName: label,
        articles: json[label]
      }
      tag = new Tag(tag)
      tag.save()
    })

  })*/

var json = {}
var num = 0
User.find()
  .exec( (err, users) => {
    users.forEach( user => {
      var tags = user.tag?user.tag:[]
        tags.concat(user.interest?user.interest:[])
        tags = [...new Set(tags)]
      tags.forEach( tag => {
        var arr = json[tag];
        if(!arr) arr = []
        arr.push(user._id)
        json[tag] = arr;
      })
    })

    console.log(json)

    var tagName = Object.keys(json)
    tagName.forEach( tag => {
      Tag.findOne({tagName: tag})
        .exec( (err, tagDB) => {
          if(tagDB){
            tagDB.set('fans', json[tag])
            tagDB.save( (err, tag)=>{
              console.log(++num)
            })
          }
        })
    })
  })



