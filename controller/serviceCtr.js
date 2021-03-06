var pool=require('../conf/conn');
var service_model=require('../model/serviceModel');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
//向前台返回json

var callback=function(res,result){
	if(result===undefined){
		console.log('－－－－－－操作服务失败－－－－－－');
		res.json({
			responseCode:'-1',
			responseMsg:'操作失败'
		});
	}else{
		res.json(result);
	}
}
module.exports={
	//添加数据-接口
	addService:function(req,res){
		pool.getConnection(function(err,connection){
			// 解析一个文件上传
			var form = new multiparty.Form();
			//设置编辑
		    form.encoding = 'utf-8';
			form.parse(req, function (err, fields, files) {
				if(fields.content==''){
					res.json({
						responseCode:'-1',
						responseMsg:'服务内容不能为空'
					});
					return;
				}
			    connection.query(service_model.queryType,[fields.type],function(err,result){
			    	if(err){
						res.json({
							responseCode:'-1',
							responseMsg:err
						});
						return;
			    	}
			    	if(result.length<=0){
			    		console.log('－－－－－－服务不存在插入数据－－－－－－');
			    		connection.query(service_model.insert,[fields.type,fields.content_zh,fields.content_en],function(err,result){
			    			if(err){
								res.json({
									responseCode:'-1',
									responseMsg:err.code
								});
			    			}else{
								console.log('－－－－－－插入成功－－－－－－');
								res.json({
									responseCode:'000000',
									responseMsg:"成功"
								});
			    			}
							//释放链接
							connection.release();
						});
			    	}else{
			    		console.log('－－－－－－数据已存在更新数据－－－－－－');
			    		connection.query(service_model.update,[fields.content_zh,fields.content_en,fields.type],function(err,result){
			    			if(err){
			    				console.log('－－－－－－更新出错－－－－－－');
								res.json({
									responseCode:'-1',
									responseMsg:err.code
								});
			    			}else{
			    				console.log('－－－－－－更新成功－－－－－－');
								res.json({
									responseCode:'000000',
									responseMsg:"成功"
								});
			    			}
							//释放链接
							connection.release();

			    		});
			    	}
			    });   
		    });
		});
	},
	queryService:function(req,res,callback){
		pool.getConnection(function(err,connection){
     		console.log('－－－－－－查询服务内容－－－－－－');
			connection.query(service_model.queryContentByType,[req.type],function(err,result){
				console.log('－－－－－－查询服务内容成功－－－－－－');
				console.log('result---->',result[0]);
				callback(result);
				connection.release();
			});
		});
	}
};