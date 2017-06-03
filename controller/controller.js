var pool=require('../conf/conn');
var multiparty = require('multiparty');

function  selectFun(res,sql,array,callbacks){
	pool.getConnection(function(err,connection){
 		console.log('－－－－－－查询内容－－－－－－');
 		console.log(array);
		connection.query(sql,array,function(err,result){
			if(err){
	    		console.log('－－－－－－查询出错－－－－－－');
	    		console.log(err);
				res.json({
					responseCode:'-1',
					responseMsg:err
				});
				return;
	    	}
			if(result){
				console.log('－－－－－－查询内容成功－－－－－－');
				callbacks(result);
			}
			connection.release();
		});
	});
}
function insertFun(res,sql,array,callbacks){
	pool.getConnection(function(err,connection){
		console.log('－－－－－－新增－－－－－－');
 		console.log(array);
 		connection.query(sql,array,function(err,result){
    	 if(err){
	    		console.log('－－－－－－新增出错－－－－－－');
				res.json({
					responseCode:'-1',
					responseMsg:err
				});
				return;
	    	}
    	 if(result){
				console.log('－－－－－－新增成功－－－－－－');
				callbacks(result);
			}
			connection.release();
     });
});
}



exports.selectFun=selectFun;