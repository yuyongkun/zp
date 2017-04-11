var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var usr = require('../public/static/admin/js/data.js');
var pagination = require('../public/static/admin/js/pagination.js');
var secondList={};
var querystring = require("querystring");
var uuid = require('node-uuid');
var AVATAR_UPLOAD_FOLDER = '/images/ueditor/';
var TITLE='admin';
var fs = require('fs');

router.get('/secondList', function(req, res, next) {
	console.log(req.query.code);
	console.log(req.query.sCode);
	client = usr.connect();
	result = null;
	var sql='SELECT productCode,productNameCh FROM second_product_list WHERE FirstCode="'+req.query.code+'"';
	console.log(sql);
	usr.selectFun(client,sql, function(result) {
		console.log(result);
		secondList=result;
		var code=result[0].productCode;
		if(req.query.sCode){
			code=req.query.sCode;
		}
		res.redirect('/product/threeList?code='+req.query.code+'&sCode='+code);
	});
    
});

router.get('/threeList', function(req, res, next) {
	console.log(req.query.code);
	console.log(req.query.sCode);
	var page={limit:10,num:1};
	if(req.query.p){
		page['num']=req.query.p<1?1:req.query.p;
	}
	var startp=(page.num-1)*page.limit;
	var endp=page.num*page.limit-1;
	var pagehelp={currentpage:page.num,code:req.query.code,pagesize:10,pagecount:10,name:req.params.name};
	client = usr.connect();
	result = null;
	var sql='SELECT t.id,t.code,t.nameCh,t.imgUrl,s.productNameCh sName,s.productCode sCode,f.productNameCh fName FROM three_product_list t,first_product_list f,second_product_list s WHERE t.secondCode="'+req.query.sCode 
	+'" AND t.secondCode=s.productCode AND t.firstCode = f.productCode ORDER BY t.code LIMIT '+startp+','+endp+'';
	console.log(sql);
	usr.selectFun(client,"SELECT COUNT(1) count  FROM three_product_list t WHERE t.secondCode='"+req.query.code+"'", function(count) {
		pagehelp['pagecount']=count[0].count;
		    var pagehtml=pagination.pagehtml(pagehelp);
			usr.selectFun(client,sql, function(result) {
				console.log(result);
				res.render('admin/product/list', { title: '新乡市艾达机械设备有限公司',secondList:secondList,list:result,locals:pagehtml,fCode:req.query.code});
			});
	});
    
});

router.get('/ueditor', function(req, res, next) {
    res.render('admin/product/ueditor', { title: '新乡市艾达机械设备有限公司' });
});

router.get('/detail/:sCode', function(req, res, next) {
	console.log(req.params.sCode);
	console.log(req.query.id);
	client = usr.connect();
	result = null;
	firstList =null;
	secondList=null;
	var firstSql="SELECT  productCode,productNameCh FROM first_product_list  order by productCode";
	
	var sql="SELECT t.id,t.code,t.nameCh,t.imgUrl,t.description,t.introduction,t.firstCode,t.secondCode FROM three_product_list t  WHERE t.id='"+req.query.id+"'";
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
	var sql="select  productCode,productNameCh from second_product_list  where FirstCode='"+firstCode+"' order by productCode";
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
	        var id="";
	        if(req.query.id){
	        	id=req.query.id;
	        }else{
	        	id=uuid.v1();
	        }
	        var avatarName =  id+ '.' + extName;
	        var newPath = form.uploadDir + avatarName;
	        console.log(newPath);
	        fs.renameSync(files.imgUrl.path, newPath);  //重命名
	        //fs.unlinkSync(newPath);
	        var sql="";
	        if(req.query.id){
	           sql="UPDATE three_product_list SET imgUrl='"+AVATAR_UPLOAD_FOLDER+ avatarName+"' WHERE id='"+req.query.id+"'";
	        }else{
	           sql="INSERT INTO three_product_list (id,imgUrl) VALUES('"+id+"','"+AVATAR_UPLOAD_FOLDER+ avatarName+"'); ";
	        }
	        console.log(sql);
	        client = usr.connect();
	        usr.selectFun(client,sql, function(result) {
	    		console.log(result);
	    		res.send(JSON.stringify({img:AVATAR_UPLOAD_FOLDER+ avatarName,id:id}));
	    	});
		    
	    });
	    
	   
	});
router.post('/saveProduct', function(req, res, next) {
	console.log(req.body.code);
	var sql="";
	if(req.body.id){
	   sql="UPDATE three_product_list SET nameCh='"+req.body.nameCh+"',introduction='"+req.body.introduction
	+"',CODE='"+req.body.code+"',firstCode='"+req.body.firstCode+"',secondCode='"+req.body.secondCode
	+"',description='"+req.body.description+"' WHERE id='"+req.body.id+"'";
	}else{
		sql="insert into three_product_list (id,nameCh,introduction,code,firstCode,secondCode,createdBy,createdDate,description) values ( uuid(),'"+req.body.nameCh
		+"','"+req.body.introduction+"','"+req.body.code+"','"+req.body.firstCode
		+"','"+req.body.secondCode+"','aidiFilter',NOW(),'"+req.body.description+"')";
	}
	console.log(sql);
	client = usr.connect();
	usr.selectFun(client,sql, function(result) {
		console.log(result);
		var obj={firstCode:req.body.firstCode,secondCode:req.body.secondCode};
		res.send(JSON.stringify(obj));
	});
});
router.get('/newProduct', function(req, res, next) {
	client = usr.connect();
	fResult = null;
	sResult=null;
	var firstSql="SELECT  productCode,productNameCh FROM first_product_list  order by productCode";
	console.log(firstSql);
	usr.selectFun(client,firstSql, function(fResult) {
		console.log(fResult);
		var firstList=fResult;
		var code=fResult[0].productCode;
		var sql="select  productCode,productNameCh from second_product_list  where FirstCode='"+code+"' order by productCode";
			console.log(sql);
			usr.selectFun(client,sql, function(result) {
				console.log(result);
				res.render('admin/product/newProduct', { title: '新乡市艾达机械设备有限公司',firstList:firstList,secondList:result});
			});
	});
});
module.exports = router;