var mysql = require('mysql');


function connectServer(){
	var client = mysql.createConnection({
	    host: '127.0.0.1',
	    port: '3306',
	    user: 'lusen',
	    password: '123456',
	    database: 'aidi'
	});
	return client;
}
 function  selectFun(client,sql,callback){
	     //client为一个mysql连接对象
	     client.query(sql,function(err,results,fields){
	         if(err) throw err;
	        callback(results);
	    });
	}
 function insertFun(client ,sql,callback){
	      client.query(sql, function(err,result){
	          if( err ){
	              console.log( "error:" + err.message);
	              return err;
	          }
	            callback(err);
	      });
	 }
   
 exports.connect = connectServer;
 exports.selectFun  = selectFun;
 exports.insertFun = insertFun;
