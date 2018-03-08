var express = require('express');
var session = require('express-session')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var md5 = require('md5')

require('./mongodb/config/mongoose')
var User = require('./mongodb/model/user.model')
var index = require('./routes/index');
var my = require('./routes/my');
var article = require('./routes/article')
var discussion = require('./routes/discussion')
var common = require('./routes/common')

var app = express();
app.use(express.static('public'));
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')

  if(req.method == 'OPTIONS') {
    //让options请求快速返回
    res.sendStatus(200);
  } else {
    next();
  }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*express-session*/
var identityKey = 'skey';
app.use(session({
  secret: 'feworld',  // 用来对session id相关的cookie进行签名
  saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
  resave: false,  // 是否每次都重新保存会话，建议false
  cookie: {
    maxAge: 60 * 100 * 1000  // 有效期，单位是毫秒
  }
}))


/* 注册用户 */
app.post('/register', function(req, res, next){
  var username = req.body.username,
   password = md5(req.body.password);

  var newUser = new User({
    username: username,
    password: password
  })

  newUser.save(function(err, user) {
    if(err && err.code == 11000 ){
      res.send({
        ret: 1,
        message: 'the username has been used'
      })
      return;
    }

    req.session.regenerate(function (err) {
      if(err){
        return res.send({
          ret: 1,
          message: '登录失败'
        })
      }

      req.session.loginUser = user.username;
      req.session.loginUserId = user._id;
      return res.send({
        ret: 0,
        message: '登录成功'
      })
    })

  })
})

/*登录*/
app.post('/login', function(req, res, next){
  var username = req.body.username,
      password = md5(req.body.password);

  User.findOne({'username': username, 'password': password}, function(err, user){
    if(!user){
      res.send({
        ret: 1,
        message: '用户名或者密码错误'
      })
      return ;
    }

    req.session.regenerate(function (err) {
      if(err){
        return res.send({
          ret: 1,
          message: '登录失败'
        })
      }

      req.session.loginUser = user.username;
      req.session.loginUserId = user._id;
      return res.send({
        ret: 0,
        message: '登录成功'
      })
    })
  })


})

/*退出登录*/
app.get('/logout', function(req, res, next){
  req.session.destroy(function(err) {
    if(err){
      return res.send({
        ret: 1,
        message: '退出登录失败'
      })
    }

    res.send({
      ret: 0,
      message: '退出登录成功'
    })
  })
})

app.use('/', index);
app.use('/my', my);
app.use('/article', article);
app.use('/discussion', discussion);
app.use('/common', common);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
