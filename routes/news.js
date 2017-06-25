var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var model=require('../model/model');
var controller=require('../controller/controller');

var pagination = require('../public/static/admin/js/pagination.js');

router.all('*', function(req, res, next) {
    res.locals.main = false;
    var path = req.path;
    console.log('path', path);
    if (req.session.islogin && req.cookies.islogin==req.session.islogin) {
		res.cookie('islogin', req.session.islogin, {
			maxAge : 300000
		});
	}else{
		res.send(JSON.stringify("Failed"));
	}
    next();
});

router.get('/new', function(req, res, next) {
	res.render('admin/news/newNews', { title: '发布新闻'});
});
router.post('/saveNews', function(req, res, next) {
	console.log('req.body.id------>'+req.body.id);
	if(req.body.id){
		sql=model.news.updateNews;
	} else {
		sql=model.news.insertNews;
	}
	var arr=[req.body.nameCh,req.body.nameEn,req.body.descriptionCh,req.body.descriptionEn,req.body.type,req.body.id];
	controller.selectFun(res,sql,arr,function(result){
	    console.log(result);
	    res.send(JSON.stringify("Success"));
	});
});
router.get('/detail', function(req, res, next) {
	console.log(req.query.id);
	var sql=model.news.queryNew;
	controller.selectFun(res,sql,[req.query.id],function(result){
		console.log(result);
		res.render('admin/news/newsDetail', { title: '编辑产品' ,result:result[0]});
	});
});
router.get('/delete', function(req, res, next) {
	console.log(req.query.id);
	controller.selectFun(res,model.news.del,[req.query.id],function(result){
	    console.log(result);
	    res.send(JSON.stringify("Success"));
	});
});
router.get('/query/:type', function(req, res, next) {
	console.log("------------1");
	var page={limit:10,num:1};
	if(req.query.p){
		page['num']=req.query.p<1?1:req.query.p;
	}
	var startp=(page.num-1)*page.limit;
	var endp=page.limit;
	var href='/news/query/'+req.params.type+'?n=10';
	var pagehelp={currentpage:page.num,pagesize:10,pagecount:10,href:href};
	var queryCount=model.news.queryCount;
	var type='1';
	var title="企业动态";
	if(req.params.type=='productInformation'){
		type='2';
		title="产品资讯";
	}
	controller.selectFun(res,queryCount,[type],function(count){
		pagehelp['pagecount']=count[0].count;
	    var pagehtml=pagination.pagehtml(pagehelp);
	    console.log("------------2");
	    var sql=model.news.queryNewsList;
	    controller.selectFun(res,sql,[type,startp,endp],function(result){
		    console.log(result);
			res.render('admin/news/list', {list:result,locals:pagehtml,title:title});
		});
	});
});

module.exports = router;