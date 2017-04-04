var express = require('express');
var router = express.Router();

/* 首页 */
router.get('/', function(req, res, next) {
    res.render('home/index', { title: '新乡市艾达机械设备有限公司' });
});
/*产品中心*/
router.get('/products', function(req, res, next) {
    res.render('home/products', { title: 'Express' });
});
/*解决方案*/
router.get('/case', function(req, res, next) {
    res.render('home/case', { title: 'Express' });
});
/*服务支持*/
router.get('/servicesupport', function(req, res, next) {
    res.render('home/servicesupport', { title: 'Express' });
});
/*联系我们*/
router.get('/contact', function(req, res, next) {
    res.render('home/contact', { title: 'Express' });
});
/*关于我们*/
router.get('/aboutus', function(req, res, next) {
    res.render('home/aboutus', { title: 'Express' });
});

module.exports = router;
