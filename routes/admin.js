var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var model=require('../model/model');
var controller=require('../controller/controller');



/*后台*/
router.get('/index', function(req, res, next) {
	 console.log('cookies', req.cookies.islogin);
	 console.log('session', req.session.islogin);
	if (req.session.islogin && req.cookies.islogin==req.session.islogin) {
		res.cookie('islogin', req.session.islogin, {
			maxAge : 300000
		});
		res.render('admin/admin', { title: '新乡市艾达机械设备有限公司',test : res.locals.islogin});
	}else{
		res.redirect('login');
	}
});

router.get('/company', function(req, res, next) {
		controller.selectFun(res,model.loginModel.queryCompany,[],function(result){
			console.log(result);
			res.render('admin/company', { title: '新乡市艾达机械设备有限公司',result : result[0]});
		});
});

router.get('/logout', function(req, res) {
	res.clearCookie('islogin');
	req.session.destroy();
	res.render('admin/login', { title: '新乡市艾达机械设备有限公司'});
});

router.get('/login', function(req, res, next) {
    res.render('admin/login', { title: '新乡市艾达机械设备有限公司'});
}).post('/login',function(req, res) {
	controller.selectFun(res,model.loginModel.queryUser,[req.body.username,req.body.password],function(result){
		if (result[0] === undefined) {
			res.send('没有该用户');
		} else {
			if (result[0].count === 1) {
				var id=uuid.v1();
				req.session.islogin = id;
				res.cookie('islogin', id, {
					maxAge : 300000
				});
				res.redirect('index');
			} else {
				res.redirect('');
			}
		}
	
	});
});

module.exports = router;
