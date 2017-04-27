// CRUD SQL语句
var loginModel = {
    queryUser: 'select count(1) count from admin where name= ? and password = ? ',
    queryCompany:'SELECT *  FROM company'
};

var productModel = {
	    queryUser: 'select count(1) count from admin where name= ? and password = ? ',
	    queryProduct:'SELECT t.id,t.code,t.nameEn,t.nameCh,t.imgUrl,t.description,t.introduction,t.createdBy,DATE_FORMAT(t.createdDate,"%Y/%c/%d") createdDate,t.description,t.descriptionEn FROM three_product_list t  WHERE t.id=?',
        queryProductList:'SELECT t.id,t.code,t.nameCh,t.imgUrl FROM three_product_list t WHERE t.secondCode= ?  ORDER BY t.code LIMIT ? ,? ',
        queryProductCount:'SELECT COUNT(1) count  FROM three_product_list t WHERE t.secondCode= ? ',
        del:'DELETE FROM three_product_list WHERE id= ? ',
        secondList:'select  productCode,productNameCh from second_product_list  where FirstCode= ? order by productCode',
        imgInsert:'INSERT INTO three_product_list (imgUrl,id) VALUES(?,?); ',
        imgUpdate:'UPDATE three_product_list SET imgUrl= ? WHERE id= ? ',
        updateProduct:'UPDATE three_product_list SET nameEn= ? , nameCh= ? ,introduction= ? ,CODE= ? ,firstCode= ? ,secondCode= ? ,description= ? ,descriptionEn= ? WHERE id=?',
        insertProduct:'insert into three_product_list (nameEn,nameCh,introduction,code,firstCode,secondCode,createdBy,createdDate,description,descriptionEn,id) values (?,?,?,?,?,?,"aidaFilter",NOW(),?,?, uuid())',
        firstList:'SELECT  productCode,productNameCh FROM first_product_list  order by productCode',
        list:'SELECT t.id,t.code,t.nameCh,t.imgUrl,s.productNameCh sName,s.productCode sCode,f.productNameCh fName,f.productCode fCode FROM three_product_list t,first_product_list f,second_product_list s WHERE t.secondCode= ? AND t.secondCode=s.productCode AND t.firstCode = f.productCode ORDER BY t.code LIMIT ? , ? ',
	};

exports.loginModel = loginModel;
exports.productModel = productModel;

