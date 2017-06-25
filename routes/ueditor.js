var express = require('express'),
    path = require('path'),
    ueditor = require("ueditor"),
    router = express.Router();


router.all('*', function(req, res, next) {
    res.locals.main = false;
    var path = req.path;
    console.log('path', path);
    if (path == '/') { //首页
        res.locals.main = true;
    }
    next();
});


router.use("/",ueditor(path.join(__dirname,'../public'),function (req,res,next){
    //客户端上传文件设置
    var ActionType = req.query.action;
    if(ActionType === 'uploadimage'){
        var file_url = '/images/ueditor/';//默认图片上传地址
        console.log('file_url------->',file_url);
        res.ue_up(file_url); 
    }else if(req.query.action === 'listimage'){//  客户端发起图片列表请求
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }else{// 客户端发起其它请求
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/ueditor.config.json');
    }
}));
module.exports = router;