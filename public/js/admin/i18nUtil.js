$(document).ready(function(){ 
	var cookie=document.cookie;
	var arr=cookie.split(";");
	var langue=arr[1];
	arr.forEach(function( val, index ) {
		var arr1=val.split("=");
		if(arr1[0] && arr1[0] == "locale"){
			langue=arr1[1];
			 return false;
		}
		});
	if(!langue){
		langue="zh";
	}
	  $("#locale").find("option[selected='true']").attr("selected",false);
	  $("#locale").find("option[value='"+langue+"']").attr("selected",true);
   	 } 
	);