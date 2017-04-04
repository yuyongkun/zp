var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var usr = require('../public/static/admin/js/data.js');


var AVATAR_UPLOAD_FOLDER = '/uploads/';
var TITLE='admin';
var uuid = require('node-uuid');
/*后台*/
router.get('/', function(req, res, next) {
    res.render('admin/index', { title: '新乡市艾达机械设备有限公司' });
});

router.get('/index', function(req, res, next) {
	if (req.cookies.islogin) {
		req.session.islogin = req.cookies.islogin;
	}
	if (req.session.islogin) {
		res.locals.islogin = req.session.islogin;
		res.render('admin/admin', { title: '新乡市艾达机械设备有限公司',test : res.locals.islogin});
	}else{
		res.redirect('login');
	}
});

router.get('/company', function(req, res, next) {
	if (req.cookies.islogin) {
		req.session.islogin = req.cookies.islogin;
	}
	if (req.session.islogin) {
		res.locals.islogin = req.session.islogin;
		res.cookie('islogin', res.locals.islogin, {
			maxAge : 600000
		});
		client = usr.connect();
		result = null;
		var sql='SELECT *  FROM company';
		console.log(sql);
		usr.selectFun(client,sql, function(result) {
			console.log(result);
			res.render('admin/company', { title: '新乡市艾达机械设备有限公司',result : result[0]});
		});
		
	}else{
		res.redirect('login');
	}
});

router.get('/logout', function(req, res) {
	res.clearCookie('islogin');
	req.session.destroy();
	res.redirect('login');
});

router.get('/login', function(req, res, next) {
    res.render('admin/login', { title: '新乡市艾达机械设备有限公司'});
}).post('/login',function(req, res) {
	client = usr.connect();
	result = null;
	var sql='select count(1) count from admin where name="'+req.body.username+'" and password = "' + req.body.password+'"';
	console.log(sql);
	usr.selectFun(client,sql, function(result) {
		if (result[0] === undefined) {
			res.send('没有该用户');
		} else {
			if (result[0].count === 1) {
				req.session.islogin = req.body.username;
				res.locals.islogin = req.session.islogin;
				res.cookie('islogin', res.locals.islogin, {
					maxAge : 600000
				});
				res.redirect('index');
			} else {
				res.redirect('');
			}
		}
	});
});

router.post('/upload', function(req, res) {
	  var form = new formidable.IncomingForm();   //创建上传表单
	      form.encoding = 'utf-8';        //设置编辑
	      form.uploadDir = 'public'+ AVATAR_UPLOAD_FOLDER;     //设置上传目录
	      form.keepExtensions = true;     //保留后缀
	      form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

	    form.parse(req, function(err, fields, files) {

	        if (err) {
	          res.locals.error = err;
	          res.render('admin', { title: TITLE });
	          return;        
	        }  
	       
	        var extName = '';  //后缀名
	        switch (files.fulAvatar.type) {
	            case 'image/pjpeg':
	                extName = 'jpg';
	                break;
	            case 'image/jpeg':
	                extName = 'jpg';
	                break;         
	            case 'image/png':
	                extName = 'png';
	                break;
	            case 'image/x-png':
	                extName = 'png';
	                break;         
	        }

	        if(extName.length == 0){
	              res.locals.error = '只支持png和jpg格式图片';
	              res.render('admin/index', { title: TITLE });
	              return;                   
	        }

	        var avatarName = uuid.v1() + '.' + extName;
	        var newPath = form.uploadDir + avatarName;

	        console.log(newPath);
	        fs.renameSync(files.fulAvatar.path, newPath);  //重命名
	        //fs.unlinkSync(newPath);
	    });
	    
	    res.locals.success = '上传成功';
	    res.render('admin/index', { title: TITLE });      
	});
module.exports = router;
