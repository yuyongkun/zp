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
    if(res.locals.inlanguage=='en'){
 		listSql=model.news.queryLastTwoEn;
 	}else{
 		listSql=model.news.queryLastTwoZh;
 	}
    controller.selectFun(res,listSql,[],function(newsList){
	    console.log(newsList);
	    res.render('home/index', { title:  res.__('Company') ,newsList:newsList});
	});
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
    res.locals.fcode=req.query.fCode;
    res.locals.code=req.query.code;
    var page = { limit: 30, num: 1 };
    if (req.query.p) {
        page['num'] = req.query.p < 1 ? 1 : req.query.p;
    }
    var startp = (page.num - 1) * page.limit;
    var endp = page.limit;
    var href='/products/list?fCode='+req.query.fCode+'&code='+req.query.code;
    var pagehelp = { currentpage: page.num,  pagesize: 30, pagecount: 30, href: href };
    
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
	var listSql;
	if(res.locals.inlanguage=='en'){
		sql=model.productModel.queryProductEn;
		listSql=model.productModel.queryProductListEn;
	}else{
		sql=model.productModel.queryProductZh;
		listSql=model.productModel.queryProductListZh;
	}
	 controller.selectFun(res,listSql,[req.query.sCode,0,12],function(list){
		 console.log(list);
		 controller.selectFun(res,sql,[req.query.id],function(result){
				console.log(result);
		        res.render('home/details', { title: '新乡市艾达机械设备有限公司', pro:result[0],locale:req.cookies.locale,list:list,secondCode:req.query.sCode});
			});
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
/*新闻中心*/
router.get('/news/list/:type',function(req,res,next){
    var who=req.params.type;
    console.log('新闻中心列表页面:',who);
    console.log("------------1");
	var page={limit:10,num:1};
	if(req.query.p){
		page['num']=req.query.p<1?1:req.query.p;
	}
	var startp=(page.num-1)*page.limit;
	var endp=page.limit;
	var href='/news/list/'+who+'?n=10';
	var pagehelp={currentpage:page.num,pagesize:10,pagecount:10,href:href};
	var queryCount=model.news.queryCount;
	
    var _title,_type;
    if(who==='entrepriseNews'){
        _title='企业动态';
        _type=1;
    }else if(who==='productInformation'){
        _title='产品资讯';
        _type=2;
    }
    
    controller.selectFun(res,queryCount,[_type],function(count){
		pagehelp['pagecount']=count[0].count;
	    var pagehtml=pagination.pagehtml(pagehelp);
	    console.log("------------2");
	    var sql;
	    if(res.locals.inlanguage=='en'){
     		sql=model.news.queryNewsListEn;
     	}else{
     		sql=model.news.queryNewsListZh;
     	}
	    
	    controller.selectFun(res,sql,[_type,startp,endp],function(result){
		    console.log(result);
			res.render('home/news', { title: _title,list:result,locals:pagehtml,type:_type});
		});
	});
});
//新闻详情
router.get('/news/detail/:id/:type',function(req,res,next){
    var id=req.params.id;
    var type=req.params.type;
    console.log('newdetails-----',id);
    var sql,listSql;
    if(res.locals.inlanguage=='en'){
 		sql=model.news.queryNewEn;
 		listSql=model.news.queryNewsListEn;
 	}else{
 		sql=model.news.queryNewZh;
 		listSql=model.news.queryNewsListEn;
 	}
    controller.selectFun(res,sql,[id],function(result){
	    console.log(result);
	    controller.selectFun(res,listSql,[type,0,5],function(list){
		    console.log(list);
		    res.render('home/news-detail', {title: '新闻详情',news:result[0],type:type,list:list});
		});
		
	});
});
//新闻详情下一个
router.get('/news/next/:id/:type',function(req,res,next){
	var id=req.params.id;
    var type=req.params.type;
    console.log('newdetails-----',id);
    var sql=model.news.queryNext;
    controller.selectFun(res,sql,[id,type],function(result){
	    console.log(result);
	    if(result[0]){
	        res.redirect('/news/detail/'+result[0].id+'/'+type);
	    }else{
	    	res.redirect('/news/detail/'+id+'/'+type);
	    }
	});
});

//新闻详情上一个
router.get('/news/last/:id/:type',function(req,res,next){
	var id=req.params.id;
    var type=req.params.type;
    console.log('newdetails-----',id);
    var sql=model.news.queryLast;
    controller.selectFun(res,sql,[id,type],function(result){
	    console.log(result);
	    if(result[0]){
	        res.redirect('/news/detail/'+result[0].id+'/'+type);
	    }else{
	    	res.redirect('/news/detail/'+id+'/'+type);
	    }
	});
});

module.exports = router;
