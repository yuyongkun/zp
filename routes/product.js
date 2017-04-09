var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var usr = require('../public/static/admin/js/data.js');
var pagination = require('../public/static/admin/js/pagination.js');
var secondList={};
var AVATAR_UPLOAD_FOLDER = '/images/ueditor/';

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
	var sql='SELECT t.code,t.nameCh,t.imgUrl,s.productNameCh sName,s.productCode sCode,f.productNameCh fName FROM three_product_list t,first_product_list f,second_product_list s WHERE t.secondCode="'+req.query.code 
	+'" AND t.secondCode=s.productCode AND t.firstCode = f.productCode ORDER BY t.code LIMIT '+startp+','+endp+'';
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

router.get('/detail/:sCode', function(req, res, next) {
	console.log(req.params.sCode);
	console.log(req.query.code);
	client = usr.connect();
	result = null;
	firstList =null;
	secondList=null;
	var firstSql="SELECT  productCode,productNameCh FROM first_product_list  order by productCode";
	
	var sql="SELECT t.code,t.nameCh,t.imgUrl,t.description,t.introduction,t.firstCode,t.secondCode FROM three_product_list t  WHERE t.code='"+req.query.code+"'";
	console.log(sql);
	usr.selectFun(client,sql, function(result) {
		console.log(result);
		usr.selectFun(client,firstSql, function(firstList) {
			console.log(firstList);
			var secondSql="select  productCode,productNameCh from second_product_list  where FirstCode='"+result[0].firstCode+"'";
			usr.selectFun(client,secondSql, function(secondList) {
				console.log(secondList);
				res.render('admin/product/productDetil', { title: '新乡市艾达机械设备有限公司' ,result:result[0],firstList:firstList,secondList:secondList});
			});
		});
		 
	});
   
});
router.get('/delete/:sCode', function(req, res, next) {
	console.log(req.params.name);
	console.log(req.query.code);
	client = usr.connect();
	result = null;
	var sql='select count(1) count from admin where name="'+req.body.username+'" and password = "' + req.body.password+'"';
	console.log(sql);
    res.render('admin/product/productDetil', { title: '新乡市艾达机械设备有限公司' });
});

router.get('/getSecondProductList/:fCode', function(req, res, next) {
	client = usr.connect();
	result = null;
	var firstCode=req.params.fCode;
	var sql="select  productCode,productNameCh from second_product_list  where FirstCode='"+firstCode+"'";
		console.log(sql);
		usr.selectFun(client,sql, function(result) {
			console.log(result);
			res.send(JSON.stringify(result));
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
	        switch (files.imgUrl.type) {
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
	        fs.renameSync(files.imgUrl.path, newPath);  //重命名
	        //fs.unlinkSync(newPath);
	    });
	    
	    res.locals.success = '上传成功';
	    res.send(JSON.stringify(newPath));
	});

module.exports = router;