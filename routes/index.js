var express = require('express');
var router = express.Router();
var usr = require('../public/static/admin/js/data.js');
var pagination = require('../public/static/admin/js/pagination.js');
var serviceDao = require('../dao/serviceDao.js');
var secondList = {};
var firstCode;

/* 首页 */
router.get('/', function(req, res, next) {
    res.render('home/index', { title: '新乡市艾达机械设备有限公司' });
});
/*解决方案*/
router.get('/case', function(req, res, next) {
    res.render('home/case', { title: '解决方案' });
});
/*服务支持*/
router.get('/servicesupport', function(req, res, next) {
    res.render('home/servicesupport', { title: '服务支持' });
});
/*服务保障*/
router.get('/ServiceGuarantee', function(req, res, next) {
    res.render('home/ServiceGuarantee', { title: '服务保障' });
});
/*服务流程*/
router.get('/ServiceProcess', function(req, res, next) {
    res.render('home/ServiceProcess', { title: '服务流程' });
});
/*联系我们*/
router.get('/contact', function(req, res, next) {
    res.render('home/contact', { title: '联系我们' });
});
/*关于我们*/
router.get('/aboutus', function(req, res, next) {
    res.render('home/aboutus', { title: '关于我们' });
});
/*产品中心*/
router.get('/products/list', function(req, res, next) {
    console.log(req.params.name);
    console.log(req.query.code);
    console.log(req.query.fCode);
    var page = { limit: 10, num: 1 };
    if (req.query.p) {
        page['num'] = req.query.p < 1 ? 1 : req.query.p;
    }
    var startp = (page.num - 1) * page.limit;
    var endp = page.num * page.limit - 1;
    var pagehelp = { currentpage: page.num, code: req.query.code, pagesize: 10, pagecount: 10, fCode: req.query.fCode };
    client = usr.connect();
    result = null;
    var sql = 'SELECT t.id,t.code,t.nameCh,t.imgUrl FROM three_product_list t WHERE t.secondCode="' + req.query.code + '" ORDER BY t.code LIMIT ' + startp + ',' + endp + '';
    console.log(sql);
    usr.selectFun(client, "SELECT COUNT(1) count  FROM three_product_list t WHERE t.secondCode='" + req.query.code + "'", function(count) {
        var pagecount = count[0].count;
        pagehelp['pagecount'] = pagecount;
        var pagehtml = pagination.pagehtml(pagehelp);
        if (pagecount == 0) {
            res.render('home/products', { title: '新乡市艾达机械设备有限公司', secondCode: req.query.code, list: [], locals: pagehtml, firstCode: req.query.fCode });
        }
        usr.selectFun(client, sql, function(result) {
            console.log(result);
            res.render('home/products', { title: '新乡市艾达机械设备有限公司', secondCode: req.query.code, list: result, locals: pagehtml, firstCode: req.query.fCode });
        });
    });
});

/*产品详情*/
router.get('/details', function(req, res, next) {
	console.log(req.query.id);
	var sql="SELECT t.id,t.code,t.nameCh,t.imgUrl,t.description,t.introduction,t.createdBy,DATE_FORMAT(t.createdDate,'%Y/%c/%d') createdDate,t.description FROM three_product_list t  WHERE t.id='"+req.query.id+"'";
	client = usr.connect();
    result = null;
	usr.selectFun(client, sql, function(result) {
        console.log(result);
        res.render('home/details', { title: '新乡市艾达机械设备有限公司', pro:result[0]});
    });
});

module.exports = router;
