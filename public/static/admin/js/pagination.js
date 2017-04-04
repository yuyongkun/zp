$(document).ready(function() {
	$("#pagination").html("<li><a class='first' href='#'>首页</a></li>"+
				"<li><a class='previous' href='#'>上一页</a></li>"+
				"<li><a class='current'  href='#'>1</a></li>"+
				"<li><a href='#'>2</a></li>"+
				"<li><a href='#'>3</a></li>"+
				"<li><a href='#'>4</a></li>"+
				"<li><a href='#'>5</a></li>"+
				"<li><a class='next' href='#'>下一页</a></li>"+
				"<li><a class='last' href='#'>末页</a></li>");
	
	
});

$(document).ready(function() {
	if($("#pagination")){
// var pagecount = locals.pagecount;
// var pagesize = locals.pagesize;
// var currentpage = locals.currentpage;
   var code=locals.code;
   var code=locals.name;
	var pagecount = 21;
	var pagesize = 10;
	var currentpage = 1;
	var counts,pagehtml="";
	if(pagecount%pagesize==0){
	    counts = parseInt(pagecount/pagesize);
	}else{
	    counts = parseInt(pagecount/pagesize)+1;
	}
	// 大于一页内容
	if(pagecount>pagesize){
		if(currentpage>1){
		   pagehtml+= '<li><a class="previous" href="/threeList/'+name+'?code='+code+'&p='+(currentpage-1)+'">上一页</a></li>';
		}
		for(var i=1;i<=counts;i++){
			if(i==currentpage){
			   pagehtml+= '<li><a class="current"  href="/threeList/'+name+'?code='+code+'&p='+i+'">'+i+'</a></li>';
			}else{
			   pagehtml+= '<li><a href="/threeList/'+name+'?code='+code+'&p='+i+'">'+i+'</a></li>';
			}
		}
		if(currentpage<counts){
		  pagehtml+= '<li><a class="next" href="/threeList/'+name+'?code='+code+'&p='+(currentpage+1)+'">下一页</a></li>';
		}
	}else{
			pagehtml="";	
	     }
	$("#pagination").html(pagehtml);
	}
	});