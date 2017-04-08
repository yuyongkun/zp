function  pagehtml(pagehelp){
	var code=pagehelp.code;
	var name=pagehelp.name;
	var pagecount = pagehelp.pagecount;
	var pagesize = pagehelp.pagesize;
	var currentpage = pagehelp.currentpage;
	var counts,pagehtml="";
	if(pagecount%pagesize==0){
	    counts = parseInt(pagecount/pagesize);
	}else{
	    counts = parseInt(pagecount/pagesize)+1;
	}
	// 大于一页内容
		if(currentpage>0){
			var num;
			if(currentpage==1){
				num=parseInt(currentpage);
			}else{
				num=parseInt(currentpage)-parseInt(1);
			}
		   pagehtml+= '<li><a class="previous" href="/product/threeList/'+name+'?code='+code+'&p='+(num)+'">上一页</a></li>';
		}
		for(var i=1;i<=counts;i++){
			if(i==currentpage){
			   pagehtml+= '<li><a class="current"  href="/product/threeList/'+name+'?code='+code+'&p='+i+'">'+i+'</a></li>';
			}else{
			   pagehtml+= '<li><a href="/product/threeList/'+name+'?code='+code+'&p='+i+'">'+i+'</a></li>';
			}
		}
		if(currentpage<counts+1){
			var num;
			if(currentpage==counts){
				num=parseInt(currentpage);
			}else{
				num=parseInt(currentpage)+parseInt(1);
			}
		  pagehtml+= '<li><a class="next" href="/product/threeList/'+name+'?code='+code+'&p='+(num)+'">下一页</a></li>';
		}
	return pagehtml;
}
exports.pagehtml  = pagehtml;