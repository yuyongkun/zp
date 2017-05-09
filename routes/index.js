var express = require('express');
var router = express.Router();
var service_controller=require('../controller/serviceCtr');
var model=require('../model/model');
var controller=require('../controller/controller');
var pagination = require('../public/static/admin/js/pagination.js');
var secondList = {};
var firstCode;
var uuid = require('node-uuid');

/* 首页 */
router.get('/', function(req, res, next) {
    res.render('home/index', { title:  res.__('Company') });
});
// //allow MANUAL locale selection
 router.get("/i18n/:locale", function (req, res) {
 	console.log(req.cookies.locale);
     res.cookie('locale',req.params.locale, {
 		maxAge : 1000*60*60*24
 	});
     res.send(JSON.stringify("Success"));
 });
/*解决方案*/
router.get('/case', function(req, res, next) {
    res.render('home/case', { title: '解决方案' });
});

/*联系我们*/
router.get('/contact', function(req, res, next) {
    res.render('home/contact', { title: '联系我们' });
});
/*关于我们*/
router.get('/aboutus', function(req, res, next) {
    res.render('home/aboutus', { title: '关于我们' });
});
/*产品中心*/
router.get('/products/list', function(req, res, next) {
    console.log(req.params.name);
    console.log(req.query.code);
    console.log(req.query.fCode);
    var page = { limit: 10, num: 1 };
    if (req.query.p) {
        page['num'] = req.query.p < 1 ? 1 : req.query.p;
    }
    var startp = (page.num - 1) * page.limit;
    var endp = page.num * page.limit - 1;
    var href='/products/list?fCode='+req.query.fCode+'&code='+req.query.code;
    var pagehelp = { currentpage: page.num,  pagesize: 10, pagecount: 10, href: href };
    
    controller.selectFun(res,model.productModel.queryProductCount,[req.query.code],function(count){
    	 var pagecount = count[0].count;
         pagehelp['pagecount'] = pagecount;
         var pagehtml = pagination.pagehtml(pagehelp);
         if (pagecount == 0) {
             res.render('home/products', { title: '新乡市艾达机械设备有限公司', secondCode: req.query.code, list: [], locals: pagehtml, firstCode: req.query.fCode });
         }
         var sql;
         if(res.locals.inlanguage=='en'){
     		sql=model.productModel.queryProductListEn;
     	}else{
     		sql=model.productModel.queryProductListZh;
     	}
         controller.selectFun(res,sql,[req.query.code,startp,endp],function(result){
        	 console.log(result);
             res.render('home/products', { title: '新乡市艾达机械设备有限公司', secondCode: req.query.code, list: result, locals: pagehtml, firstCode: req.query.fCode });
     	});
	});
});

/*产品详情*/
router.get('/details', function(req, res, next) {
	var sql;
	if(res.locals.inlanguage=='en'){
		sql=model.productModel.queryProductEn;
	}else{
		sql=model.productModel.queryProductZh;
	}
	controller.selectFun(res,sql,[req.query.id],function(result){
		console.log(result);
        res.render('home/details', { title: '新乡市艾达机械设备有限公司', pro:result[0],locale:req.cookies.locale});
	});
});
/*服务支持*/
router.get('/service/:who', function(req, res, next) {
    var param=req.params;
    param=param.who;

    res.locals.title='服务支持';
    res.locals.type=1;
    if(param==='guarantee'){
        res.locals.title='服务保障';
        res.locals.type=2;
    }else if(param==='process'){
        res.locals.title='服务流程';
        res.locals.type=3;
    }
    req.type=res.locals.type;
    service_controller.queryService(req,res,function(result){
        var content;
        if(result.length>0){
            content=result[0].content;
        }
        res.render('home/servicesupport', {
            serviceContent:content
        });
        
    });
});
/*公司简介,公司荣誉,公司文化*/
router.get('/companyinfo',function(req,res,next){
    res.render('home/companyinfo',{
        title:'公司简介',
        type:1
    });
});
router.get('/companyhonor',function(req,res,next){
    res.render('home/companyhonor',{
        title:'公司荣誉',
        type:2
    });
});
router.get('/companyculture',function(req,res,next){
    res.render('home/companyculture',{
        title:'公司文化',
        type:3
    });
});
router.get('/contactus',function(req,res,next){
    res.render('home/contactus',{
        title:'联系我们',
        type:4
    });
});


module.exports = router;
