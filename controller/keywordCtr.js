var pool=require('../conf/conn');
var keyword_model=require('../model/keywordModel');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var uuid = require('node-uuid');
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
	addKeyword:function(req,res){
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
				if(fields.content==''){
					res.json({
						responseCode:'-1',
						responseMsg:'关键词内容不能为空'
					});
					return;
				}
			    connection.query(keyword_model.queryKeyword,[fields.number],function(err,result){
			    	if(err){
						res.json({
							responseCode:'-1',
							responseMsg:err
						});
						return;
			    	}
			    	if(result.length<=0){
			    		console.log('－－－－－－关键词不存在插入数据－－－－－－');
			    		var id=uuid.v1();
			    		console.log('fields------>',fields);
			    		connection.query(keyword_model.insert,[id,fields.number,fields.keyword,fields.describes],function(err,result){
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
			    		connection.query(keyword_model.update,[fields.keyword,fields.describes,fields.number],function(err,result){
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
	queryKeyword:function(req,res,callback){
		pool.getConnection(function(err,connection){
     		console.log('－－－－－－查询关键词－－－－－－');
     		console.log('number--->'+req.number);

			connection.query(keyword_model.queryKeyword,[req.number],function(err,result){
				console.log('查询关键词---->',result);
				if(result){
					console.log('－－－－－－查询关键词成功－－－－－－');
					callback(result);
				}
				connection.release();
			});
		});
	}
};