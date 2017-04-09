var usr = require('./data.js');

function getFirstProductList(){
	client = usr.connect();
	result = null;
	var sql="SELECT  productCode,productNameCh FROM first_product_list";
		console.log(sql);
		usr.selectFun(client,sql, function(result) {
			console.log(result);
			 return result;
		});
}

function getSecondProductList(firstCode){
	client = usr.connect();
	result = null;
	var sql="select  productCode,productNameCh from second_product_list  where FirstCode='"+firstCode+"'";
		console.log(sql);
		usr.selectFun(client,sql, function(result) {
			console.log(result);
			 return result;
		});
}

exports.getFirstProductList = getFirstProductList;
exports.getSecondProductList = getSecondProductList;