var mysql=require('mysql');
var conf=require('./db');
//使用连接池,并将句柄返回
module.exports=mysql.createPool(conf.mysql);