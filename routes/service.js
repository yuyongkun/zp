var express = require('express');
var router = express.Router();
var service_controller = require('../controller/serviceCtr');
//设置服务页面
router.get('/setservice/:who', function(req, res, next) {
    res.locals.title = '修改服务';
    var param = req.params;

    param = param.who;
    res.locals.type = 1;

    if (param == 2) {
        res.locals.type = 2;
    } else if (param == 3) {
        res.locals.type = 3;
    }
    req.type = res.locals.type;
    service_controller.queryService(req, res, function(result) {
        if (result.length <= 0) {
			content = '';
        }else{
        	content = result[0].content;
        }
        res.render('admin/setservice', {
            title: "修改服务",
            serviceContent: content
        });
    });

});
//添加服务-接口
router.post('/add_service', function(req, res, next) {
    console.log('添加服务-接口');
    service_controller.addService(req, res, next);
});


module.exports = router;
