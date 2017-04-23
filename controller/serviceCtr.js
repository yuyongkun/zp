var pool=require('../conf/conn');
var service_model=require('../model/serviceModel');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
//向前台返回json

var callback=function(res,result){
	if(result===undefined){
		console.log('－－－－－－操作服务失败－－－－－－');
		console.log(result);
		res.json({
			responseCode:'-1',
			responseMsg:'操作失败'
		});
	}else{
		res.json(result);
	}
}
module.exports={
	//添加数据
	addService:function(req,res){
		pool.getConnection(function(err,connection){
			 // 解析一个文件上传
			var form = new multiparty.Form();
			//设置编辑
		    form.encoding = 'utf-8';
		    //设置文件存储路径
		    // form.uploadDir = "uploads/images/";
		    //设置单文件大小限制
		    // form.maxFilesSize = 2 * 1024 * 1024;
		    //form.maxFields = 1000;  设置所以文件的大小总和
			form.parse(req, function (err, fields, files) {
				console.log('－－－－－－参数－－－－－－');
				console.log(fields);
				if(fields.content===''){
					res.json({
						responseCode:'-1',
						responseMsg:'服务内容不能为空'
					});
					return;
				}
			    connection.query(service_model.queryType,[fields.type],function(err,result){
			    	if(err){
			    		console.log('－－－－－－查询服务出错－－－－－－');
						res.json({
							responseCode:'-1',
							responseMsg:err
						});
						return;
			    	}
			    	console.log('－－－－－－查询服务成功－－－－－－');
			    	console.log(result);
			    	if(result.length<=0){
			    		console.log('－－－－－－服务不存在插入数据－－－－－－');
			    		connection.query(service_model.insert,[fields.type,fields.type,fields.content],function(err,result){
							if(result){
								var result={
									responseCode:'000000',
									responseMsg:"成功"
								};

							}
							//返回结果
							res.json(result);
							//释放链接
							connection.release();
						});
			    	}else{
			    		console.log('－－－－－－服务已存在更新数据－－－－－－');
			    		connection.query(service_model.update,[fields.content,fields.type],function(err,result){
			    			if(result){
			    				console.log('－－－－－－更新成功－－－－－－');
			    				console.log(result);
			    				var result={
									responseCode:'000000',
									responseMsg:"成功"
								};
			    			}
			    			callback(res,result);
							//释放链接
							connection.release();

			    		});
			    	}
			    });   
		    });
		});
	},
	queryService:function(req,res,callbacks){
		pool.getConnection(function(err,connection){
     		console.log('－－－－－－查询服务内容－－－－－－');
     		console.log(req.type);
			connection.query(service_model.queryContentByType,[req.type],function(err,result){
				if(result){
					console.log('－－－－－－查询服务内容成功－－－－－－');
					console.log(result);
					callbacks(result);
				}
				connection.release();
			});
		});
	}
};