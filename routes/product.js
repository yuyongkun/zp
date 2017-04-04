var express = require('express');
var router = express.Router();
var usr = require('../public/static/admin/js/data.js');
var pagination = require('../public/static/admin/js/pagination.js');
var secondList={};

router.get('/secondList/:name', function(req, res, next) {
	console.log(req.query.code);
	client = usr.connect();
	result = null;
	var sql='SELECT productCode,productNameCh FROM second_product_list WHERE FirstCode="'+req.query.code+'"';
	console.log(sql);
	usr.selectFun(client,sql, function(result) {
		console.log(result);
		secondList=result;
		var code=result[0].productCode;
		var name=result[0].productNameEn;
		res.redirect('/product/threeList/'+name+'?code='+code);
	});
    
});

router.get('/threeList/:name', function(req, res, next) {
	console.log(req.params.name);
	console.log(req.query.code);
	var page={limit:10,num:1};
	if(req.query.p){
		page['num']=req.query.p<1?1:req.query.p;
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
		pagehelp['pagecount']=count[0].count;
		    var pagehtml=pagination.pagehtml(pagehelp);
			usr.selectFun(client,sql, function(result) {
				console.log(result);
				res.render('admin/product/list', { title: '新乡市艾达机械设备有限公司',secondList:secondList,list:result,locals:pagehtml});
			});
	});
    
});

router.get('/ueditor', function(req, res, next) {
    res.render('admin/product/ueditor', { title: '新乡市艾达机械设备有限公司' });
});

router.get('/detail/:name', function(req, res, next) {
	console.log(req.params.name);
	client = usr.connect();
	result = null;
	var sql='select count(1) count from admin where name="'+req.body.username+'" and password = "' + req.body.password+'"';
	console.log(sql);
    res.render('admin/product/hydraulicFilter/productDetil', { title: '新乡市艾达机械设备有限公司' });
});


module.exports = router;