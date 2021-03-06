var express = require('express');
var router = express.Router();
var fs = require('fs');
var uuid = require('node-uuid');
var multiparty = require('multiparty');
var util = require('util');
var model=require('../model/model');
var controller=require('../controller/controller');

var pagination = require('../public/static/admin/js/pagination.js');

var AVATAR_UPLOAD_FOLDER = '/images/ueditor/';

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


router.get('/productList', function(req, res, next) {
	console.log(req.query.code);
	console.log(req.query.sCode);
	var code=req.query.code;
	var secondCode=req.query.sCode;
	var page={limit:10,num:1};
	if(req.query.p){
		page['num']=req.query.p<1?1:req.query.p;
	}
	var startp=(page.num-1)*page.limit;
	var endp=page.limit;
	var href='/product/productList?code='+req.query.code+'&sCode='+req.query.sCode;
	var pagehelp={currentpage:page.num,pagesize:10,pagecount:10,href:href};
	var queryCount=model.productModel.queryProductCount;
	var firstSql=model.productModel.firstList;
	var secondSql=model.productModel.secondList;
	
	controller.selectFun(res,firstSql,[code],function(firstList){
		console.log(firstList);
		controller.selectFun(res,secondSql,[code],function(secondList){
			console.log(secondList);
			controller.selectFun(res,queryCount,[secondCode],function(count){
				pagehelp['pagecount']=count[0].count;
			    var pagehtml=pagination.pagehtml(pagehelp);
			    var sql=model.productModel.list;
			    controller.selectFun(res,sql,[secondCode,startp,endp],function(result){
				    console.log(result);
					res.render('admin/product/list', { title: '产品列表',code:code,secondCode:secondCode,
						secondList:secondList,list:result,locals:pagehtml,firstList:firstList});
				});
			});
		});
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
	var endp=page.limit;
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
		if(req.query.image){
			var path="../public"+req.query.image;
			fs.exists(path, function(exists){
				console.log(exists);
				if(exists){
					fs.unlinkSync(path,function(err){
						if(err){
							console.log(err);
							throw err;
						}
					});
				}
				
			});
		}
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
	        console.log(fields);
	        var firstCode=fields.firstCode[0];
	        var secondCode=fields.secondCode[0];
	        var extName = '';  //后缀名
	        console.log(files);
	        if(files && files.imgUrl){
	        console.log(files.imgUrl);
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
	        console.log(newPath);
	        fs.renameSync(file.path, newPath);
	        //fs.unlinkSync(newPath);
	        var sql="";
	        if(req.query.id){
	           sql=model.productModel.imgUpdate;
	        }else{
	           sql=model.productModel.imgInsert;
	        }
	        controller.selectFun(res,sql,[AVATAR_UPLOAD_FOLDER+ avatarName,id,firstCode,secondCode],function(result){
				console.log(result);
				res.send(JSON.stringify({id:id,img:AVATAR_UPLOAD_FOLDER+ avatarName}));
			});
	        }
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
	console.log(req.body.firstCode);
	var arr=[req.body.nameEn,req.body.nameCh,req.body.firstCode,req.body.secondCode,req.body.description,req.body.descriptionEn,req.body.brandZh,
	         req.body.brandEn,req.body.modelZh,req.body.modelEn,req.body.applicationFieldZh,req.body.applicationFieldEn,req.body.filterMaterialZh,req.body.filterMaterialEn,
	         req.body.filtrationPrecision,req.body.operatingTemperature,req.body.nominalPressure,req.body.id];
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

router.get('/hot/product', function(req, res, next) {
	var page={limit:10,num:1};
	if(req.query.p){
		page['num']=req.query.p<1?1:req.query.p;
	}
	var startp=(page.num-1)*page.limit;
	var endp=page.limit;
	var href='/product/hot/product';
	var pagehelp={currentpage:page.num,pagesize:10,pagecount:10,href:href};
	
	var sql=model.hot.query;
	var queryCount=model.hot.queryCount;
	 
	 controller.selectFun(res,queryCount,[],function(count){
			pagehelp['pagecount']=count[0].count;
		    var pagehtml=pagination.pagehtml(pagehelp);
		    controller.selectFun(res,sql,[startp,endp],function(result){
			    console.log(result);
				res.render('admin/hot/list', { title: '热门列表',list:result,locals:pagehtml});
			});
		});
});

router.get('/deleteHot/:id', function(req, res, next) {
	console.log(req.params.id);
	var sql=model.hot.del;
	 controller.selectFun(res,sql,[req.params.id],function(result){
			res.send(JSON.stringify("SUCESS"));
		});
});

router.post('/saveHot', function(req, res, next) {
	console.log(req.body.id);
	var sql=model.hot.insert;
	var query=model.hot.queryOne;
	controller.selectFun(res,query,[req.body.id],function(count){
		console.log(count[0]);
		if(count[0].count==0){
			controller.selectFun(res,sql,[req.body.id],function(result){
				res.send(JSON.stringify("SUCESS"));
			});
		}else{
		        res.send(JSON.stringify("FAILE"));
		}
	});
	 
});

router.get('/newHot', function(req, res, next) {
	var firstSql=model.productModel.firstList;
	var secondSql=model.productModel.secondList;
	controller.selectFun(res,firstSql,[],function(firstList){
		var code=firstList[0].productCode;
			controller.selectFun(res,secondSql,[code],function(secondList){
				console.log(secondList);
				res.render('admin/hot/newHot', { title: '新增热门' ,firstList:firstList,secondList:secondList});
				});
		});
});

router.get('/hot/queryProduct', function(req, res, next) {
	console.log(req.query.secondCode);
	
	var page={limit:10,num:1};
	if(req.query.p){
		page['num']=req.query.p<1?1:req.query.p;
	}
	var startp=(page.num-1)*page.limit;
	var endp=page.limit;
	var href='/product/hot/queryProduct?1=1';
	var pagehelp={currentpage:page.num,pagesize:10,pagecount:10,href:href};
	
	var queryProCount=model.hot.queryProCount;

	var sql=model.hot.queryProduct;
	var arr=[];

	if(req.query.nameCh){
		sql=sql+' and t.nameCh like CONCAT ("%",?,"%") ';
		queryProCount=queryProCount+' and t.nameCh like CONCAT ("%",?,"%") ';
		arr.push(req.query.nameCh);
	}
	if(req.query.nameEn){
		sql=sql+' and t.nameEn like CONCAT ("%",?,"%") ';
		queryProCount=queryProCount+' and t.nameEn like CONCAT ("%",?,"%") ';
		arr.push(req.query.nameEn);
	}
	if(req.query.firstCode){
		sql=sql+' and t.firstCode= ? ';
		queryProCount=queryProCount+' and t.firstCode= ? ';
		arr.push(req.query.firstCode);
	}
	if(req.query.secondCode){
		sql=sql+'and t.secondCode= ? ';
		queryProCount=queryProCount+'and t.secondCode= ? ';
		arr.push(req.query.secondCode);
	}
	 controller.selectFun(res,queryProCount,arr,function(count){
		    pagehelp['pagecount']=count[0].count;
		    var pagehtml=pagination.pagehtml(pagehelp);
		    sql=sql+' ORDER BY t.code LIMIT ?,? ';
			arr.push(startp);
			arr.push(endp);
			 controller.selectFun(res,sql,arr,function(result){
				 console.log(result);
				 var obj={list:result,locals:pagehtml};
				 res.send(JSON.stringify(obj));
				});
	});
	
});

router.get('/first/delete', function(req, res, next) {
	var sql=model.column.deleteFirst;
	var id=req.query.id;
	console.log(id);
	controller.selectFun(res,sql,[id],function(result){
		      res.send(JSON.stringify("SUCESS"));
		});
});

router.get('/first/list', function(req, res, next) {
	var page={limit:10,num:1};
	if(req.query.p){
		page['num']=req.query.p<1?1:req.query.p;
	}
	var startp=(page.num-1)*page.limit;
	var endp=page.limit;
	var href='/product/first/list?1=1';
	var pagehelp={currentpage:page.num,pagesize:10,pagecount:10,href:href};
	
	var queryfirstCount=model.column.queryfirstCount;
	var sql=model.column.firstList;
	controller.selectFun(res,queryfirstCount,[],function(count){
		 pagehelp['pagecount']=count[0].count;
		 var pagehtml=pagination.pagehtml(pagehelp);
		 controller.selectFun(res,sql,[startp,endp],function(result){
			 console.log(result);
			 res.render('admin/column/firstList', { title: '一级产品列表' ,list:result,locals:pagehtml});
			});
				
		});
});

router.post('/first/save', function(req, res, next) {
	var sql=model.column.insertFirst;
	var id=req.body.id;
	console.log(id);
	if(id){
		sql=model.column.updateFirst;
	}
	var arr=[req.body.productNameEn,req.body.productNameCh,id];
	controller.selectFun(res,sql,arr,function(result){
		      res.send(JSON.stringify("SUCESS"));
		});
});

router.get('/first/query', function(req, res, next) {
	var sql=model.column.queryFirst;
	var id=req.query.id;
	controller.selectFun(res,sql,[id],function(result){
		console.log(result);
		  res.render('admin/column/editFirst', { title: '一级产品列表' ,result:result[0]});
		});
});

router.get('/first/new', function(req, res, next) {
	  res.render('admin/column/newFirst', { title: '新增一级栏目' });
});

router.get('/second/delete', function(req, res, next) {
	var sql=model.column.deleteSecond;
	var id=req.query.id;
	console.log(id);
	controller.selectFun(res,sql,[id],function(result){
		      res.send(JSON.stringify("SUCESS"));
		});
});

router.get('/second/list', function(req, res, next) {
	var page={limit:10,num:1};
	var code=req.query.code;
	console.log(code);
	if(req.query.p){
		page['num']=req.query.p<1?1:req.query.p;
	}
	var startp=(page.num-1)*page.limit;
	var endp=page.limit;
	var href='/product/second/list?code='+code;
	var pagehelp={currentpage:page.num,pagesize:10,pagecount:10,href:href};
	
	var querySecondCount=model.column.querySecondCount;
	var sql=model.column.secondList;
	var firstListSql=model.productModel.firstList;
	controller.selectFun(res,querySecondCount,[code],function(count){
		 pagehelp['pagecount']=count[0].count;
		 var pagehtml=pagination.pagehtml(pagehelp);
		 controller.selectFun(res,sql,[code,startp,endp],function(result){
			 console.log(result);
			 controller.selectFun(res,firstListSql,[],function(firstList){
				 console.log(firstList);
				 res.render('admin/column/secondList', { title: '一级产品列表' ,list:result,locals:pagehtml,firstList:firstList});
				});
			});
				
		});
});

router.post('/second/save', function(req, res, next) {
	var sql=model.column.insertSecond;
	var id=req.body.id;
	console.log('--------------'+id);
	if(id){
		sql=model.column.updateSecond;
	}
	var arr=[req.body.productNameEn,req.body.productNameCh,req.body.firstCode,req.body.id];
	console.log('--------------'+arr);
	controller.selectFun(res,sql,arr,function(result){
		      res.send(JSON.stringify("SUCESS"));
		});
});

router.get('/second/query', function(req, res, next) {
	var sql=model.column.querySecond;
	var firstListSql=model.productModel.firstList;
	var id=req.query.id;
	console.log(id);
	controller.selectFun(res,sql,[id],function(result){
		 console.log(result);
		controller.selectFun(res,firstListSql,[],function(firstList){
			 console.log(firstList);
			 res.render('admin/column/editSecond', { title: '二级产品列表' ,firstList:firstList,result:result[0]});
			});
		});
});
router.get('/second/new', function(req, res, next) {
	var firstListSql=model.productModel.firstList;
	controller.selectFun(res,firstListSql,[],function(firstList){
		 console.log(firstList);
		 res.render('admin/column/newSecond', { title: '新增二级栏目' ,firstList:firstList});
		});
});
module.exports = router;