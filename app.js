var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var i18n = require('i18n');
var uuid = require('node-uuid');

var index = require('./routes/index');
var admin = require('./routes/admin');
var product = require('./routes/product');
var ueditor = require('./routes/ueditor');
var service = require('./routes/service');
var news = require('./routes/news');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: uuid.v4(),
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
//configure i18n
i18n.configure({
    locales: [
        'en',
        'zh'
    ],
    directory:__dirname+'/i18n',
    //  locales:['en', 'zh'],  // setup some locales - other locales default to en_US silently
    // defaultLocale: 'zh',
    // directory:__dirname+'/i18n',  // i18n 翻译文件目录，我的是 i18n， 可以写成其他的。
    // updateFiles: false,
    // indent: "\t",
    // extension: '.js'  // 由于 JSON 不允许注释，所以用 js 会方便一点，也可以写成其他的，不过文件格式是 JSON
});

app.use(i18n.init);
app.use(function(req, res, next) {
    console.log("req.hostname------>",req.hostname);
    if (req.hostname== 'en.aidafilter.cn') {
        res.locals.inlanguage='en';
        i18n.setLocale(req, 'en');
    } else {
        res.locals.inlanguage='zh';
        i18n.setLocale(req, 'zh');
    }
    next();
});

app.use('/admin', admin);
app.use('/product', product);
app.use('/ueditor', ueditor);
app.use('/service', service);
app.use('/adminNews', news);
app.use('/', index);


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
