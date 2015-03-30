var popWin=function(url,win,para) {
	var win = window.open(url,win,para);
	win.focus();
}

var setLocation=function(url){
	window.location=url;
}

/* ajax*/
var setLocationAjax=function(ajaxurl,surl,bool,param){
	url= ajaxurl+"/"+formatUrl(surl)+"/"+bool+"/"+param;
	jQuery("body").append('<div id="loading"></div>');
	if (bool==false){
		jQuery.ajax(url,{	
			type: "GET",
			cache: true,
			success: function(data, textStatus, jqXHR){	
				jQuery("#loading").remove();
				window.location.href=surl;	
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				alert("The request was not completed successfuly.");
				
			}
		});
	}else{
		jQuery.ajax(url,{	
			type: "GET",
			dataType: "json",
			cache: true,
			success: function(data, textStatus, jqXHR){
				ajaxUpdate.changeContent(data);
				jQuery("#loading").remove();		
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				jQuery("#loading").remove();
				alert("The request was not completed successfuly.");
				
			}
		});
	}
	
};
/*** with post values ****/
var setLocationAjaxAction=function(form,ajaxurl,surl,bool,id,param,urlredirect){
	if (id!=""){
		url= ajaxurl+"/"+formatUrl(surl)+"/"+bool+"/"+id;
	}else{
		url= ajaxurl+"/"+formatUrl(surl)+"/"+bool;
	}
	jQuery("body").append('<div id="loading"></div>');
	if (bool==false){
		jQuery.ajax(url,{	
		type: "POST",
		cache: false, 
		data: param,
		success: function(data, textStatus, jqXHR){
				jQuery("#loading").remove();
				window.location.href=urlredirect;
			},
		error: function(jqXHR, textStatus, errorThrown)
			{
				jQuery("#loading").remove();
				alert("The request was not completed successfuly.");
			}
		});
	}else{
	
		jQuery.ajax(url,{	
		type: "POST",  
		dataType: "json",
		cache: false, 
		data: param,
		success: function(data, textStatus, jqXHR){
				ajaxUpdate.changeContent(data);
				jQuery("#loading").remove();
			},
		complete:function(){
			jQuery('#'+form).each(function(){
				this.reset();
			});
		},
		error: function(jqXHR, textStatus, errorThrown)
			{
				alert("The request was not completed successfuly.");
			}
		});
	}
	
};

/* change url format */
var formatUrl=function(str){
	
	str = str.replace(/-/g,"--");
	
	var url="";
	
	for (var x = 0; x < str.length; x++)
	{
	    var c = str.charAt(x);
		
		switch (c) {
			case "/": 
				 c='-S';
				 if (x!=str.length-1)
				 	url=url + c;
				 break;
			case "?": c='-Q';  url=url + c;  break;
			case ":": c='-C';  url=url + c;  break;
			case "&": c='-A'; url=url + c;  break;
			case "\\": c='-B'; url=url + c;  break;
			default: url=url +c;  break;
		}
	}
	return url;
}

var removeFilter=function(first_url,str,all,defaulturl){
	
	var prevurl=jQuery('#prevurl').val().split("/"); // get the previous url 
	var old_url=prevurl[1];
	var new_url=old_url.replace(formatUrl(str),''); // remove the filter from the previous url
	if (all){
		new_url=formatUrl(defaulturl);
	}
	var urltosplit=old_url+"/"+ new_url; 
	var url=first_url+"/"+old_url+"/"+new_url; // new url after removing the filter
	
	if (all){ // if remove all filter
		url=first_url+"/"+old_url+"/"+formatUrl(defaulturl); 
	}
	
	jQuery("body").append('<div id="loading"></div>');
	$j.ajax(url,{	
		type: "GET",  
		dataType: "json",
		success: function(data, textStatus, jqXHR){
				ajaxUpdate.changeContent(data);
				jQuery('#prevurl').val(urltosplit);
				jQuery("#loading").remove();
			},
		error: function(jqXHR, textStatus, errorThrown)
		{
			jQuery("#loading").remove();
			alert("The request was not completed successfuly.");
		
		}
	  
	});
	
	
}

var selectaction=function(first_url,second_url,str) { 
	var old_url=formatUrl(second_url);
	var url_new=formatUrl(second_url);
	var str= formatUrl(str); // format the filter string
	//alert(old_url);
	
	if (!jQuery('#prevurl').val()){
		var urltosplit=old_url+"/"+url_new+"-S"+str;
		
	}else{
		var prevurl=jQuery('#prevurl').val().split("/"); // get the previous url
		old_url=prevurl[1];	// override the value of old_url
		var urltosplit=old_url+"/"+formatUrl(second_url)+"-S"+str;
	}
	//alert(urltosplit);
	var url=first_url+"/"+old_url+"/"+url_new+"-S"+str;
	jQuery("body").append('<div id="loading"></div>');
	//alert(url);
	$j.ajax(url,{	
	type: "GET",  
	dataType: "json",
	success: function(data, textStatus, jqXHR){
			ajaxUpdate.changeContent(data);
			if (!jQuery('#prevurl').val()){
				jQuery("body").append('<input type="hidden" id="prevurl" value="'+urltosplit+'"/>');
			}else{
				jQuery('#prevurl').val(urltosplit);
			}
			jQuery("#loading").remove();
		},
	error: function(jqXHR, textStatus, errorThrown)
	{
		jQuery("#loading").remove();
		alert("The request was not completed successfuly.");
		
	}
	
	});

}

/*  add to cart */
var actionCart=function(form,first_url,second_url,flag,id,cart_url,post_data) { 
	var url_new=formatUrl(second_url);
	var url=first_url+"/"+url_new+"/"+flag+"/"+id+"/";
	jQuery("body").append('<div id="loading"></div>');
	alert(url);
	if (flag==false){
		jQuery.ajax(url,{
			type: "POST",
			cache: true,
			data: post_data,
			success: function(data, textStatus, jqXHR){
				jQuery("#loading").remove();
				window.location.href=cart_url;
			},
			error: function(jqXHR, textStatus, errorThrown){
				jQuery("#loading").remove();
				alert("The request was not completed successfuly.");
				
			},
		});
	}else{
		jQuery.ajax(url,{
			type: "POST",
			dataType: "json",
			cache: true,
			data: post_data,
			success: function(data, textStatus, jqXHR){
				ajaxUpdate.changeContent(data);
				jQuery("#loading").remove();
			},
			error: function(jqXHR, textStatus, errorThrown){
				jQuery("#loading").remove();
				alert("The request was not completed successfuly.");
				
			},
		});
	}
}

/***** submit form *****/
var submitAjaxAction= function(formid,ajaxurl,surl,ajax_update,id,param,urlredirect){

	jQuery("#"+formid).validate({
		submitHandler: function(form){
			setLocationAjaxAction(formid,ajaxurl,surl,ajax_update,id,param,urlredirect);
		}
	});
}

var ajaxUpdate = function() {
	return {
		current_object: [],
		temp: 0,
		pos:0,
		changeContent : function(data) {
			var prev_obj;
			$j(data).each(function(index){
				var location= data[index].Location;
				current_object = $j("body");
				var current_el;
				console.log(location);
				$j(location).each(function(i){
					var pos = location[i];
					prev_obj=current_object;
					ajaxUpdate.pos=pos;
					ajaxUpdate.temp=0;
					if (typeof current_object != 'undefined' &&  current_object.children().size()) {
						current_object.children().each(function(){
							if (jQuery(this).is('div')){
								ajaxUpdate.temp=ajaxUpdate.temp+1;
								//console.log(ajaxUpdate.temp+"="+ajaxUpdate.pos);
								if (ajaxUpdate.temp==ajaxUpdate.pos){
									current_object=jQuery(this);
								}
							}else{
								if (ajaxUpdate.getChildren(jQuery(this))){
									current_object=jQuery(ajaxUpdate.getChildren(jQuery(this)));
									ajaxUpdate.current_object=[]; // reset
									return false;
								}
							}
						})
					}
				});
				console.log(data[index].Content);
				$j(current_object).html(data[index].Content);
		
			});
		},

		getChildren	:	function(elem){
			var found=false;
			if (elem.children().size()){
				elem.children().each(function(){
					if (jQuery(this).is('div')){
						ajaxUpdate.temp=ajaxUpdate.temp+1;
						//console.log(ajaxUpdate.temp+"=="+ajaxUpdate.pos);
						if (ajaxUpdate.temp==ajaxUpdate.pos){
							found=true;
							//console.log(jQuery(this));
							ajaxUpdate.current_object.push(this);
							return false;
						}
					}else{
						ajaxUpdate.getChildren(jQuery(this));
					}
					if(found) { return false};
				})
				if (ajaxUpdate.current_object.length)
					return ajaxUpdate.current_object;
				else
					return false;
			}
				
			
		}
	}
}();
/*** update content ****/

var changecontent=function(data){
	var prev_obj;
	
	$j(data).each(function(index){
		
		var location= data[index].Location;
		var current_object = $j("body");
		var current_el;
		console.log(location);
		$j(location).each(function(i){
			var pos = location[i];
			prev_obj=current_object;
			current_el=current_object.children().slice(pos - 1,pos);
			current_object = current_object.children("div").slice(pos - 1,pos);
			
			if(current_object.size()==0 && current_el.size()!=0 ){
				current_object=jQuery(current_el).find('div').slice(pos-1,pos);
				prev_obj=current_object.parents('div').first();

			}else if(current_object.size()==0 && current_el.size()==0 ) {
				current_object=prev_obj.children().children('div').slice(pos-1);
			}
			
		});
		console.log(data[index].Content);
		$j(current_object).html(data[index].Content);
		
	});
		
}

/** product option **/
var reloadPrice=function(ajaxupdateurl,pageurl,ajaxurl,param){
	
	var pageurl=formatUrl(pageurl);
	var ajaxurl=formatUrl(ajaxurl);
	var url=ajaxupdateurl+"/"+pageurl+"/"+ajaxurl;
	jQuery("body").append('<div id="loading"></div>');
	alert(url);
	console.log(param);
	jQuery.ajax(url,{	
	type: "POST",
	dataType: "json",
	data: param,
	success: function(data, textStatus, jqXHR){
			ajaxUpdate.changeContent(data);
			jQuery("#loading").remove();
	},
	error: function(jqXHR, textStatus, errorThrown)
		{
			jQuery("#loading").remove();
			alert("The request was not completed successfuly.");
		}
	});

};


  

