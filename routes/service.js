var express=require('express');
var router=express.Router();
var service_controller=require('../controller/serviceCtr');
//新建服务页面
router.get('/',function(req,res,next){
	res.render('admin/serviceadd',{
		title:"新建服务",
	});
});

//修改服务页面
router.get('/edit/:who',function(req,res,next){
	console.log('-------修改服务参数--------');
	res.locals.title='修改服务';
	var param=req.params;
	console.log(param);

	param=param.who;
	res.locals.type=1;
	
	if(param==2){
		res.locals.type=2;
	}else if(param==3){
		res.locals.type=3;
	}
	req.type=res.locals.type;
	service_controller.queryService(req,res,function(result){
		if(result.length>0){
			content=result[0].content;
			res.render('admin/serviceedit',{
				title:"修改服务",
				serviceContent:content
			});
		}
	});
	
});
//添加服务
router.post('/addservice',function(req,res,next){
	service_controller.addService(req,res,next);
});


module.exports=router;
