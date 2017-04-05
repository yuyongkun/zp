var express = require('express');
var router = express.Router();

/* 首页 */
router.get('/', function(req, res, next) {
    res.render('home/index', { title: '新乡市艾达机械设备有限公司' });
});
/*产品中心*/
router.get('/products', function(req, res, next) {
    res.render('home/products', { title: '产品中心' });
});
/*产品详情*/
router.get('/details', function(req, res, next) {
    res.render('home/details', { title: '产品详情' });
});
/*解决方案*/
router.get('/case', function(req, res, next) {
    res.render('home/case', { title: '解决方案' });
});
/*服务支持*/
router.get('/servicesupport', function(req, res, next) {
    res.render('home/servicesupport', { title: '服务支持' });
});
/*服务保证*/
router.get('/ServiceGuarantee', function(req, res, next) {
    res.render('home/ServiceGuarantee', { title: '服务保证' });
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

module.exports = router;
