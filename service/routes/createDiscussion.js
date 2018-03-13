/**
 * Created by linGo on 2018/3/8.
 */

//连接数据库
require('../mongodb/config/mongoose')

var Discussion = require('../mongodb/model/discussion.model')

var discussion = {
  author: '5a4b76338b69bb25d83da3ca',
  content: "我一路看过千山和万水\n 也一起看过东南和西北\n",
  type: 0,
  buildTime: Date.now()
}

discussion = new Discussion(discussion)
discussion.save()