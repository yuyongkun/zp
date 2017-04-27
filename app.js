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

//configure i18n
i18n.configure({
    locales: [
        'en',
        'zh'
    ],
    directory: __dirname + '/i18n'
});
app.use(i18n.init);
// set locale (on every request), if session locale exists
// otherwise use default browser setting
app.use(function(req, res, next) {
    // check if user has changed i18n settings
    if (req.cookies && req.cookies.locale) {
        console.log('---55555555555555---' + req.cookies.locale);
        i18n.setLocale(req, req.cookies.locale);
    } else {
        res.cookie('locale', 'zh', {
            maxAge: 600000
        });
        i18n.setLocale(req, 'zh');
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/admin', admin);
app.use('/product', product);
app.use('/ueditor', ueditor);
app.use('/service', service);

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
