// CRUD SQL语句
var loginModel = {
    queryUser: 'select count(1) count from admin where name= ? and password = ? ',
    queryCompany:'SELECT *  FROM company'
};

var productModel = {
	    queryUser: 'select count(1) count from admin where name= ? and password = ? ',
	    queryProduct:'SELECT t.id,t.code,t.nameEn,t.nameCh,t.imgUrl,t.description,t.introduction,t.createdBy,DATE_FORMAT(t.createdDate,"%Y/%c/%d") createdDate,t.description,t.descriptionEn,t.firstCode,t.secondCode, t.brandZh,t.brandEn,t.modelZh,t.modelEn,t.applicationFieldZh,t.applicationFieldEn,'+
        't.filterMaterialZh,t.filterMaterialEn,t.filtrationPrecision,t.operatingTemperature,t.nominalPressure FROM three_product_list t  WHERE t.id=?',
	    queryProductEn:'SELECT t.nameEn name,t.imgUrl,t.createdBy,DATE_FORMAT(t.createdDate,"%Y/%c/%d") createdDate,t.descriptionEn description,t.brandEn brand,t.modelEn model,t.applicationFieldEn applicationField,t.filterMaterialEn filterMaterial,t.filtrationPrecision,t.operatingTemperature,t.nominalPressure FROM three_product_list t  WHERE t.id=?',
	    queryProductZh:'SELECT t.nameCh name,t.imgUrl,t.createdBy,DATE_FORMAT(t.createdDate,"%Y/%c/%d") createdDate,t.description,t.brandZh brand,t.modelZh model,t.applicationFieldZh applicationField,t.filterMaterialZh filterMaterial,t.filtrationPrecision,t.operatingTemperature,t.nominalPressure  FROM three_product_list t  WHERE t.id=?',
	    queryProductListEn:'SELECT t.id,t.code,t.nameEn name,t.imgUrl FROM three_product_list t WHERE t.secondCode= ?  ORDER BY t.code LIMIT ? ,? ',
	    queryProductListZh:'SELECT t.id,t.code,t.nameCh name,t.imgUrl FROM three_product_list t WHERE t.secondCode= ?  ORDER BY t.code LIMIT ? ,? ',
	    queryProductCount:'SELECT COUNT(1) count  FROM three_product_list t WHERE t.secondCode= ? ',
        del:'DELETE FROM three_product_list WHERE id= ? ',
        secondList:'select  productCode,productNameCh from second_product_list  where FirstCode= ? order by productCode',
        imgInsert:'INSERT INTO three_product_list (imgUrl,id,firstCode,secondCode,createdBy,createdDate) VALUES(?,?,?,?,"aidaFilter",NOW()); ',
        imgUpdate:'UPDATE three_product_list SET imgUrl= ?,firstCode=?,secondCode=? WHERE id= ? ',
        updateProduct:'UPDATE three_product_list SET nameEn= ? , nameCh= ? ,CODE= ? ,firstCode= ? ,secondCode= ? ,description= ? ,descriptionEn= ?,brandZh= ?,brandEn=?,modelZh=?,modelEn=?,applicationFieldZh=? ,applicationFieldEn=?,'
        	           +'filterMaterialZh=?,filterMaterialEn=?,filtrationPrecision=?,operatingTemperature=?,nominalPressure=? WHERE id=?',
        insertProduct:'insert into three_product_list (nameEn,nameCh,code,firstCode,secondCode,createdBy,createdDate,description,descriptionEn,brandZh,brandEn,modelZh,modelEn,applicationFieldZh,applicationFieldEn,'+
                       'filterMaterialZh,filterMaterialEn,filtrationPrecision,operatingTemperature,nominalPressure,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"aidaFilter",NOW(),?,?, uuid())',
        firstList:'SELECT  productCode,productNameCh FROM first_product_list  order by productCode',
        list:'SELECT t.id,t.code,t.nameCh,t.imgUrl,s.productNameCh sName,s.productCode sCode,f.productNameCh fName,f.productCode fCode FROM three_product_list t,first_product_list f,second_product_list s WHERE t.secondCode= ? AND t.secondCode=s.productCode AND t.firstCode = f.productCode ORDER BY t.code LIMIT ? , ? ',
	};
var news = {
		queryCount:'SELECT COUNT(1) count  FROM news t where t.type=?',
		queryNew:'SELECT t.id,t.nameCh,t.nameEn,t.type,t.descriptionEn,t.descriptionCh FROM news t WHERE t.id= ?',
		queryNewEn:'SELECT t.id,t.nameEn name,t.descriptionEn description,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t WHERE t.id= ?',
		queryNewZh:'SELECT t.id,t.nameCh name,t.descriptionCh description,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t WHERE t.id= ?',
		queryNewsList:'SELECT t.id,t.nameCh name,t.type,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t where t.type=? ORDER BY t.createDate LIMIT ? , ? ',
		queryNewsListEn:'SELECT t.id,t.nameEn name,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t where t.type=? ORDER BY t.createDate LIMIT ? , ? ',
		queryNewsListZh:'SELECT t.id,t.nameCh name,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t where t.type=? ORDER BY t.createDate LIMIT ? , ? ',
		updateNews:'UPDATE news  SET nameCh= ? ,nameEn= ? ,descriptionCh= ? ,descriptionEn= ?,type=?  WHERE id= ? ',
		insertNews:'INSERT INTO news (id,nameCh,nameEn,descriptionCh,descriptionEn,type,createBy,createDate) VALUES(UUID(),?,?,?,?,?,"aidaFilter",NOW())',
		del:'DELETE FROM news WHERE id=?'
};

exports.news = news;
exports.loginModel = loginModel;
exports.productModel = productModel;

