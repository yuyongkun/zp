var express = require('express');
var router = express.Router();
var usr = require('../public/static/admin/js/data.js');
var pagination = require('../public/static/admin/js/pagination.js');
var secondList={};
var firstCode;

/* 首页 */
router.get('/', function(req, res, next) {
    res.render('home/index', { title: '新乡市艾达机械设备有限公司' });
});
/*解决方案*/
router.get('/case', function(req, res, next) {
    res.render('home/case', { title: 'Express' });
});
/*服务支持*/
router.get('/servicesupport', function(req, res, next) {
    res.render('home/servicesupport', { title: 'Express' });
});
/*服务保证*/
router.get('/ServiceGuarantee', function(req, res, next) {
    res.render('home/ServiceGuarantee', { title: 'Express' });
});
/*服务流程*/
router.get('/ServiceProcess', function(req, res, next) {
    res.render('home/ServiceProcess', { title: 'Express' });
});
/*联系我们*/
router.get('/contact', function(req, res, next) {
    res.render('home/contact', { title: 'Express' });
});
/*关于我们*/
router.get('/aboutus', function(req, res, next) {
    res.render('home/aboutus', { title: 'Express' });
});
/*产品中心*/
router.get('/products/:code', function(req, res, next) {
	console.log(req.params.code);
	firstCode=req.params.code;
	client = usr.connect();
	result = null;
	var sql='SELECT productCode,productNameEn,productNameCh FROM second_product_list WHERE FirstCode="'+req.params.code+'"';
	console.log(sql);
	usr.selectFun(client,sql, function(result) {
		console.log(result);
		secondList=result;
		var code=result[0].productCode;
		var name=result[0].productNameEn;
		res.redirect('/products/list/'+name+'?code='+code);
	});
});
router.get('/products/list/:name', function(req, res, next) {
	console.log(req.params.name);
	console.log(req.query.code);
	var page={limit:10,num:1};
	if(req.query.p){
		page['num']=req.query.p<1?1:req.query.p;13523020493
	}
	var startp=(page.num-1)*page.limit;
	var endp=page.num*page.limit-1;
	var pagehelp={currentpage:page.num,code:req.query.code,pagesize:10,pagecount:10,name:req.params.name};
	client = usr.connect();
	result = null;
	var sql='SELECT t.code,t.nameCh,t.imgUrl,s.productNameCh sName,f.productNameCh fName FROM three_product_list t,first_product_list f,second_product_list s WHERE t.secondCode="'+req.query.code 
	+'" AND t.secondCode=s.productCode AND t.FirstCode = f.productCode ORDER BY t.code LIMIT '+startp+','+endp+'';
	console.log(sql);
	usr.selectFun(client,"SELECT COUNT(1) count  FROM three_product_list t WHERE t.secondCode='"+req.query.code+"'", function(count) {
		    var pagecount=count[0].count;
		    pagehelp['pagecount'] = pagecount;
		    var pagehtml=pagination.pagehtml(pagehelp);
		    if(pagecount==0){
		    	res.render('home/products', { title: '新乡市艾达机械设备有限公司',secondList:secondList,list:[],locals:pagehtml,firstCode:firstCode});
		    }
			usr.selectFun(client,sql, function(result) {
				console.log(result);
				res.render('home/products', { title: '新乡市艾达机械设备有限公司',secondList:secondList,list:result,locals:pagehtml,firstCode:firstCode});
			});
	});
});

/*产品详情*/
router.get('/details/:code', function(req, res, next) {
    res.render('home/details', { title: 'Express' });
});

module.exports = router;
