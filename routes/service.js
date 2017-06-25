var express = require('express');
var router = express.Router();
var service_controller = require('../controller/serviceCtr');

router.all('*', function(req, res, next) {
    res.locals.main = false;
    var path = req.path;
    console.log('path', path);
    if (req.session.islogin && req.cookies.islogin==req.session.islogin) {
		res.cookie('islogin', req.session.islogin, {
			maxAge : 300000
		});
	}else{
		res.send(JSON.stringify("Failed"));
	}
    next();
});
//设置服务页面
router.get('/setservice/:who', function(req, res, next) {
    var param = req.params;
    param = param.who;
    req.type=res.locals.type=param;
    service_controller.queryService(req, res, function(result) {
        console.log('result--->',result[0]);
        if (result.length <= 0) {
            result[0]='';
        }
        res.render('admin/setservice', {
            title: "设置服务",
            content: result[0],
        });
    });

});
//添加服务-接口
router.post('/add_service', function(req, res, next) {
    console.log('添加服务-接口');
    service_controller.addService(req, res, next);
});


module.exports = router;
