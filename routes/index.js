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
	var newsListSql,hotListSql;
    if(res.locals.inlanguage=='en'){
    	newsListSql=model.news.queryLastTwoEn;
    	hotListSql=model.hot.queryProductEn;
 	}else{
 		newsListSql=model.news.queryLastTwoZh;
 		hotListSql=model.hot.queryProductZh;
 	}
    controller.selectFun(res,newsListSql,[],function(newsList){
	    console.log(newsList);
        controller.selectFun(res,hotListSql,[],function(hotList){
    	    console.log(hotList);
            console.log('indexTitle---->',res.__('indexTitle'));
    	    res.render('home/index', { title:  res.__('indexTitle') ,newsList:newsList,hotList:hotList});
    	});
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
    res.render('home/case', { title: res.__('caseTitle') });
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
             res.render('home/products', { title: res.__('productsTitle'), secondCode: req.query.code, list: [], locals: pagehtml, firstCode: req.query.fCode });
         }
         var sql;
         if(res.locals.inlanguage=='en'){
     		sql=model.productModel.queryProductListEn;
     	}else{
     		sql=model.productModel.queryProductListZh;
     	}
         controller.selectFun(res,sql,[req.query.code,startp,endp],function(result){
        	 console.log(result);
             res.render('home/products', { title: res.__('productsTitle'), secondCode: req.query.code, list: result, locals: pagehtml, firstCode: req.query.fCode });
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
				var hotWord;
				if(result[0]){
					hotWord=result[0].name;
				}
		        res.render('home/details', { title: hotWord+'-'+res.__('Company'), pro:result[0],locale:req.cookies.locale,list:list,secondCode:req.query.sCode});
			});
 	});
	
});
/*服务支持*/
router.get('/servicenav/:who', function(req, res, next) {
    var param=req.params;
    param=param.who;

    res.locals.title='服务支持';
    res.locals.type=1;
    var lasturl='servicesupport';
    if(param==='serviceguarantee'){
        res.locals.title='服务保障';
        res.locals.type=2;
        lasturl='serviceguarantee';
    }else if(param==='serviceprocess'){
        res.locals.title='服务流程';
        res.locals.type=3;
        lasturl='serviceprocess';
    }
    req.type=res.locals.type;
    service_controller.queryService(req,res,function(result){
        var content;
        if(result.length>0){
            content=result[0].content;
        }
        res.render('home/'+lasturl, {
            title:res.__('serviceSupportTitle'),
            serviceContent:content,
        });
        
    });
});
/*公司简介,公司荣誉,公司文化*/
router.get('/companyinfo',function(req,res,next){
    res.render('home/companyinfo',{
        title:res.__('CompanyProfile')+'-'+res.__('Company'),
        type:1
    });
});
router.get('/companyhonor',function(req,res,next){
    res.render('home/companyhonor',{
       title:res.__('CompanyHonor')+'-'+res.__('Company'),
        type:2
    });
});
router.get('/companyculture',function(req,res,next){
    res.render('home/companyculture',{
        title:res.__('CompanyCulture')+'-'+res.__('Company'),
        type:3
    });
});
router.get('/contactus',function(req,res,next){
    res.render('home/contactus',{
        title:res.__('ContactUs')+'-'+res.__('Company'),
        type:4
    });
});
/*新闻中心*/
router.get('/news/:type',function(req,res,next){
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
        _title=res.__('EntreprisesNews');
        _type=1;
    }else if(who==='productInformation'){
        _title=res.__('ProductInformation');
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
router.get('/archives/:id/:type',function(req,res,next){
    var id=req.params.id;
    var type=req.params.type;
    console.log('newdetails-----',id);
    var sql,listSql,nextSql,lastSql;
    if(res.locals.inlanguage=='en'){
 		sql=model.news.queryNewEn;
 		listSql=model.news.queryNewsListEn;
 		nextSql=model.news.queryNextEn;
 		lastSql=model.news.queryLastEn;
 	}else{
 		sql=model.news.queryNewZh;
 		listSql=model.news.queryNewsListZh;
 		nextSql=model.news.queryNextZh;
 		lastSql=model.news.queryLastZh;
 	}
    controller.selectFun(res,sql,[id],function(result){
	    console.log(result);
	    controller.selectFun(res,listSql,[1,0,5],function(entrepriseNewsList){
		    console.log(entrepriseNewsList);
		    controller.selectFun(res,listSql,[2,0,5],function(productInformationList){
			    console.log(productInformationList);
			    controller.selectFun(res,nextSql,[id,type],function(nextlist){
				    console.log(nextlist);
				    var next;
				    if(nextlist[0]){
				    	next=nextlist[0];
				    }
				    controller.selectFun(res,lastSql,[id,type],function(lastlist){
					    var last;
					    if(lastlist[0]){
					    	last=lastlist[0];
					    }
				    res.render('home/news-detail', {title: res.__('NewsDetails')+'-'+res.__('Company'),last:last,next:next,
				    	news:result[0],type:type,entrepriseNewsList:entrepriseNewsList,productInformationList:productInformationList});
				});
			    });
			});
		});
		
	});
});

module.exports = router;
