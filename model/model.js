// CRUD SQL语句
var loginModel = {
    queryUser: 'select count(1) count from admin where name= ? and password = ? ',
    queryCompany:'SELECT *  FROM company'
};
var productNameModel={
	 firstProductName:'SELECT productNameCh,productNameEn FROM first_product_list where productCode=?',
	 secondProductName:'SELECT productNameCh,productNameEn FROM second_product_list where productCode=?',
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
        updateProduct:'UPDATE three_product_list SET nameEn= ? , nameCh= ? ,firstCode= ? ,secondCode= ? ,description= ? ,descriptionEn= ?,brandZh= ?,brandEn=?,modelZh=?,modelEn=?,applicationFieldZh=? ,applicationFieldEn=?,'
        	           +'filterMaterialZh=?,filterMaterialEn=?,filtrationPrecision=?,operatingTemperature=?,nominalPressure=? WHERE id=?',
        insertProduct:'insert into three_product_list (nameEn,nameCh,firstCode,secondCode,description,descriptionEn,brandZh,brandEn,modelZh,modelEn,applicationFieldZh,applicationFieldEn,'+
                       'filterMaterialZh,filterMaterialEn,filtrationPrecision,operatingTemperature,nominalPressure,createdBy,createdDate,id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,"aidaFilter",NOW(), uuid())',
        firstList:'SELECT  productCode,productNameCh FROM first_product_list  order by productCode',
        list:'SELECT t.id,t.code,t.nameCh,t.imgUrl,s.productNameCh sName,s.productCode sCode,f.productNameCh fName,f.productCode fCode FROM three_product_list t,first_product_list f,second_product_list s WHERE t.secondCode= ? AND t.secondCode=s.productCode AND t.firstCode = f.productCode ORDER BY t.code LIMIT ? , ? ',
	};
var index = {
	    queryProductEn:'SELECT t.nameEn name,t.code,t.imgUrl,t.createdBy,DATE_FORMAT(t.createdDate,"%Y/%c/%d") createdDate,t.descriptionEn description,t.brandEn brand,t.modelEn model,t.applicationFieldEn applicationField,t.filterMaterialEn filterMaterial,t.filtrationPrecision,t.operatingTemperature,t.nominalPressure FROM three_product_list t  WHERE t.code=?',
	    queryProductZh:'SELECT t.nameCh name,t.code,t.imgUrl,t.createdBy,DATE_FORMAT(t.createdDate,"%Y/%c/%d") createdDate,t.description,t.brandZh brand,t.modelZh model,t.applicationFieldZh applicationField,t.filterMaterialZh filterMaterial,t.filtrationPrecision,t.operatingTemperature,t.nominalPressure  FROM three_product_list t  WHERE t.code=?',
	    queryNewEn:'SELECT t.id,t.code,t.nameEn name,t.descriptionEn description,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t WHERE t.code= ?',
		queryNewZh:'SELECT t.id,t.code,t.nameCh name,t.descriptionCh description,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t WHERE t.code= ?',
};
var news = {
		queryCount:'SELECT COUNT(1) count  FROM news t where t.type=?',
		queryNew:'SELECT t.id,t.code,t.nameCh,t.nameEn,t.type,t.descriptionEn,t.descriptionCh FROM news t WHERE t.id= ?',
		queryNewEn:'SELECT t.id,t.code,t.nameEn name,t.descriptionEn description,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t WHERE t.id= ?',
		queryNewZh:'SELECT t.id,t.code,t.nameCh name,t.descriptionCh description,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t WHERE t.id= ?',
		queryNewsList:'SELECT t.id,t.code,t.nameCh name,t.type,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t where t.type=? ORDER BY t.createDate desc LIMIT ? , ? ',
		queryNewsListEn:'SELECT t.id,t.code,t.nameEn name,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t where t.type=? ORDER BY t.createDate DESC LIMIT ? , ? ',
		queryNewsListZh:'SELECT t.id,t.code,t.nameCh name,t.createBy,DATE_FORMAT(t.createDate,"%Y/%c/%d") createDate FROM news t where t.type=? ORDER BY t.createDate DESC LIMIT ? , ? ',
		updateNews:'UPDATE news  SET nameCh= ? ,nameEn= ? ,descriptionCh= ? ,descriptionEn= ?,type=?  WHERE id= ? ',
		insertNews:'INSERT INTO news (id,nameCh,nameEn,descriptionCh,descriptionEn,type,createBy,createDate) VALUES(UUID(),?,?,?,?,?,"aidaFilter",NOW())',
		del:'DELETE FROM news WHERE id=?',
		queryNextEn:'SELECT t.id,t.code,t.nameEn name FROM news t WHERE t.`createDate`<(SELECT createDate FROM news WHERE id= ? ) and t.type= ? ORDER BY t.createDate LIMIT 1',
		queryNextZh:'SELECT t.id,t.code,t.nameCh name FROM news t WHERE t.`createDate`<(SELECT createDate FROM news WHERE id= ? ) and t.type= ? ORDER BY t.createDate LIMIT 1',
		queryLastEn:'SELECT t.id,t.code,t.nameEn name FROM news t WHERE t.`createDate`>(SELECT createDate FROM news WHERE id= ? ) and t.type= ? ORDER BY t.createDate DESC LIMIT 1',
		queryLastZh:'SELECT t.id,t.code,t.nameCh name FROM news t WHERE t.`createDate`>(SELECT createDate FROM news WHERE id= ? ) and t.type= ? ORDER BY t.createDate DESC LIMIT 1',
		queryLastTwoEn:'SELECT  s1.id,s1.code,s1.nameEn name,s1.createBy,DATE_FORMAT(s1.createDate,"%Y/%c/%d") createDate,s1.type FROM news s1  WHERE  (SELECT COUNT(1) FROM news s2 WHERE s2.type=s1.type AND s2.createDate >= s1.createDate) <=1',
		queryLastTwoZh:'SELECT  s1.id,s1.code,s1.nameCh name,s1.createBy,DATE_FORMAT(s1.createDate,"%Y/%c/%d") createDate,s1.type FROM news s1  WHERE  (SELECT COUNT(1) FROM news s2 WHERE s2.type=s1.type AND s2.createDate >= s1.createDate) <=1',
};

var hot={
		queryCount:'select count(1) count from hotProduct',
		queryOne:'select count(1) count from hotProduct where  proId=?',
		insert:'INSERT  INTO hotProduct (id,proId,createDate) VALUES (UUID(),?,NOW())',
		del:'DELETE FROM hotProduct WHERE id=?',
		query:'SELECT h.id,t.code,t.nameCh,t.imgUrl,s.productNameCh sName,s.productCode sCode,f.productNameCh fName,f.productCode fCode FROM three_product_list t,first_product_list f,second_product_list s,hotProduct h WHERE h.proId= t.id AND t.secondCode=s.productCode AND t.firstCode = f.productCode ORDER BY t.code LIMIT ?,? ',
		queryProduct:'SELECT t.id,t.code,t.nameCh,t.imgUrl,s.productNameCh sName,s.productCode sCode,f.productNameCh fName,f.productCode fCode FROM three_product_list t,first_product_list f,second_product_list s WHERE t.secondCode=s.productCode AND t.firstCode = f.productCode ',
		queryProCount:'SELECT count(1) FROM three_product_list t,first_product_list f,second_product_list s WHERE t.secondCode=s.productCode AND t.firstCode = f.productCode ',
		queryProductEn:'SELECT t.id,t.code,t.nameEn name,t.imgUrl,s.productNameEn sName,s.productCode sCode,f.productNameEn fName,f.productCode fCode FROM three_product_list t,first_product_list f,second_product_list s,hotProduct h WHERE h.proId= t.id AND t.secondCode=s.productCode AND t.firstCode = f.productCode ORDER BY t.code ',
		queryProductZh:'SELECT t.id,t.code,t.nameCh name,t.imgUrl,s.productNameCh sName,s.productCode sCode,f.productNameCh fName,f.productCode fCode FROM three_product_list t,first_product_list f,second_product_list s,hotProduct h WHERE h.proId= t.id AND t.secondCode=s.productCode AND t.firstCode = f.productCode ORDER BY t.code ',
};

var column={
		deleteFirst:'delete from first_product_list where id= ?',
		firstList:'select id,productCode,productNameCh,productNameEn from first_product_list order by productCode  limit ?,? ',
		queryFirst:'select id,productCode,productNameEn,productNameCh from first_product_list where id= ?',
		queryfirstCount:'select count(1) count from first_product_list',
		insertFirst:'INSERT INTO first_product_list (productCode,productNameEn,productNameCh,id,status,createdby,createdDate) VALUES (?,?,?,UUID(),"1","aidaFilter",NOW())',
		updateFirst:'UPDATE first_product_list SET productCode =?,productNameEn=?,productNameCh=? WHERE id=?',
		deleteSecond:'delete from second_product_list where id= ?',
		querySecondCount:'select count(1) count from second_product_list where firstCode=?',
		secondList:'SELECT t.id,t.productCode,t.productNameCh,t.productNameEn,f.productNameCh fName,f.productCode fCode FROM first_product_list f,second_product_list t WHERE t.FirstCode=f.productCode AND t.FirstCode=? order by t.productCode LIMIT ?,? ',
		insertSecond:'INSERT INTO second_product_list (productCode,productNameEn,productNameCh,FirstCode,id,status,createdby,createdDate) VALUES (?,?,?,?,UUID(),"1","aidaFilter",NOW())',
		updateSecond:'UPDATE second_product_list SET productCode =?,productNameEn=?,productNameCh=?,FirstCode=? WHERE id=?',
		querySecond:'SELECT t.id,t.productCode,t.productNameCh,t.productNameEn,f.productNameCh fName,f.productCode fCode FROM first_product_list f,second_product_list t WHERE t.FirstCode=f.productCode AND t.id=?'
};

exports.news = news;
exports.index = index;
exports.hot = hot;
exports.column = column;
exports.loginModel = loginModel;
exports.productModel = productModel;
exports.productNameModel = productNameModel;

