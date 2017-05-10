var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('node-uuid');
var multiparty = require('multiparty');
var util = require('util');
var model=require('../model/model');
var controller=require('../controller/controller');

var pagination = require('../public/static/admin/js/pagination.js');

var secondList={};
var AVATAR_UPLOAD_FOLDER = '/images/ueditor/';


router.get('/secondList', function(req, res, next) {
	console.log(req.query.code);
	console.log(req.query.sCode);
	var sql=model.productModel.secondList;
	
	controller.selectFun(res,model.productModel.secondList,[req.query.code],function(result){
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
	var href='/product/threeList?code='+req.query.code+'&sCode='+req.query.sCode;
	var pagehelp={currentpage:page.num,pagesize:10,pagecount:10,href:href};
	var queryCount=model.productModel.queryProductCount;
	controller.selectFun(res,queryCount,[req.query.sCode],function(count){
		pagehelp['pagecount']=count[0].count;
	    var pagehtml=pagination.pagehtml(pagehelp);
	    var sql=model.productModel.list;
	    controller.selectFun(res,sql,[req.query.sCode,startp,endp],function(result){
		    console.log(result);
			res.render('admin/product/list', { title: '产品列表',secondList:secondList,list:result,locals:pagehtml,fCode:req.query.code});
		});
	});
});

router.get('/ueditor', function(req, res, next) {
    res.render('admin/product/ueditor', { title: '新乡市艾达机械设备有限公司' });
});

router.get('/i18n', function(req, res, next) {
	console.log(req.session.locale);
    res.render('admin/product/i18n', { title: res.__('Hello') });
});

router.get('/detail/:sCode', function(req, res, next) {
	console.log(req.params.sCode);
	console.log(req.query.id);
	var sql=model.productModel.queryProduct;
	controller.selectFun(res,sql,[req.query.id],function(result){
		console.log(result);
		var firstSql=model.productModel.firstList;
		var secondSql=model.productModel.secondList;
		controller.selectFun(res,firstSql,[],function(firstList){
			var code=firstList[0].productCode;
				controller.selectFun(res,secondSql,[code],function(secondList){
					console.log(result);
					res.render('admin/product/productDetil', { title: '编辑产品' ,result:result[0],firstList:firstList,secondList:secondList});
					});
			});
	});
});
router.get('/delete', function(req, res, next) {
	console.log(req.query.id);
	console.log(req.query.image);
	controller.selectFun(res,model.productModel.del,[req.query.id],function(result){
		console.log(result);
		fs.unlinkSync("../public"+req.query.image,function(err){
			if(err){
				console.log(err);
				throw err;
			}
		});
		res.send(JSON.stringify("Success"));
	});
});

router.get('/getSecondProductList/:fCode', function(req, res, next) {
	console.log(req.params.fCode);
		controller.selectFun(res,model.productModel.secondList,[req.params.fCode],function(result){
			console.log(result);
			res.send(JSON.stringify(result));
		});
    
});


router.post('/upload', function(req, res) {
	console.log('upload-----------------------------');
	    var form = new multiparty.Form({
	    	uploadDir :'../public'+ AVATAR_UPLOAD_FOLDER,
	    	encoding:"utf-8",//设置编辑
	    	keepExtensions:true,//保留后缀
	    	maxFieldsSize:2 * 1024 * 1024//文件大小
	    });  //创建上传表单
	      form.parse(req, function(err, fields, files) {
	        if (err) {
	          res.locals.error = err;
	          console.log(err);
	          return;        
	        }  
	        var extName = '';  //后缀名
	        console.log(files);
	        console.log(files.imgUrl);
	        console.log(files.imgUrl.type);
	        var file=files.imgUrl[0];
	        console.log(file.originalFilename);
	        var type=file.originalFilename.split(".")[1];
	        switch (type) {
	            case 'jpg':
	                extName = 'jpg';
	                break;
	            case 'png':
	                extName = 'png';
	                break;
	        }
	        console.log(extName.length);
	        if(extName.length == 0){
	              res.locals.error = '只支持png和jpg格式图片';
	              res.render('admin/admin', { title: 'admin' });
	              return;                   
	        }
	        var id="";
	        if(req.query.id){
	        	id=req.query.id;
	        }else{
	        	id=uuid.v1();
	        }
	        var avatarName =  id+ '.' + extName;
	        var newPath = '../public'+ AVATAR_UPLOAD_FOLDER+ avatarName;
	        fs.renameSync(file.path, newPath);
	        //fs.unlinkSync(newPath);
	        var sql="";
	        if(req.query.id){
	           sql=model.productModel.imgUpdate;
	        }else{
	           sql=model.productModel.imgInsert;
	        }
	        controller.selectFun(res,sql,[AVATAR_UPLOAD_FOLDER+ avatarName,id],function(result){
				console.log(result);
				res.send(JSON.stringify({id:id,img:AVATAR_UPLOAD_FOLDER+ avatarName}));
			});
	    });
	   
	});
router.post('/saveProduct', function(req, res, next) {
	console.log(req.body.code);
	var sql="";
	if(req.body.id){
	   sql=model.productModel.updateProduct;
	}else{
		sql=model.productModel.insertProduct;
	}
	
	var arr=[req.body.nameEn,req.body.nameCh,req.body.code,req.body.firstCode,req.body.secondCode,req.body.description,req.body.descriptionEn,req.body.id];
	 controller.selectFun(res,sql,arr,function(result){
		 console.log(result);
			var obj={firstCode:req.body.firstCode,secondCode:req.body.secondCode};
			res.send(JSON.stringify(obj));
		});
});
router.get('/newProduct', function(req, res, next) {
	var firstSql=model.productModel.firstList;
	var sql=model.productModel.secondList;
	controller.selectFun(res,firstSql,[],function(fResult){
		var firstList=fResult;
		var code=fResult[0].productCode;
			controller.selectFun(res,sql,[code],function(result){
				console.log(result);
				res.render('admin/product/newProduct', { title: '新增产品',firstList:firstList,secondList:result});
				});
		});

});
module.exports = router;