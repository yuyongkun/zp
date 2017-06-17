var pool=require('../conf/conn');
var keyword_model=require('../model/keywordModel');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var uuid = require('node-uuid');
//向前台返回json

var callback=function(res,result){
	if(result===undefined){
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
			    		connection.query(keyword_model.insert,[fields.number,fields.keyword,fields.describes],function(err,result){
			    			if(err){
								res.json({
									responseCode:'-1',
									responseMsg:err.code
								});
			    			}else{
								res.json({
									responseCode:'000000',
									responseMsg:"成功"
								});
			    			}
							//释放链接
							connection.release();
						});
			    	}else{
			    		connection.query(keyword_model.update,[fields.keyword,fields.describes,fields.number],function(err,result){
			    			if(err){
								res.json({
									responseCode:'-1',
									responseMsg:err.code
								});
			    			}else{
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
			connection.query(keyword_model.queryKeyword,[req.number],function(err,result){
				if(result){
					callback(result);
				}
				connection.release();
			});
		});
	}
};