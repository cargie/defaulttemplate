/* color attributes */
$j('.links-nav').live('click',function() {	
	var tmpid = $j(this).closest('.color-plp').attr('id');
   	$j("#attribute"+tmpid).val($j(this).attr("id"));
	$j("#attribute"+tmpid).trigger("onchange"); 
	
});

/* on change select attributes */
var updateconfigproduct=function(url,id){

	$j.ajax(url,{
		type: "GET",  
		success: function(data, textStatus, jqXHR){	
				console.log(data);
				$j('#prd'+id).replaceWith(data); 
			},
		error: function(jqXHR, textStatus, errorThrown)
		{
			alert("The request was not completed successfuly.");
		}	 
	});
}
/*** get the selected attributes ***/
var SelectedAttr=function(id){
	
	var str="";
	$j('div#conf-attributes'+id+' select').each(function(){
		var selectname=$j(this).attr('name');
		var selectid=$j(this).attr('id');
		//var selected=$j('div#conf-attributes'+id+' select#' + selectid + ' option:selected').html();
		var selectedval=$j('div#conf-attributes'+id+' select#' + selectid).val();	
		if (selectedval){	
		 str=str+"/"+selectname+"/"+selectedval;
		}
		
	});
	str=str.substring(1);
	return str;
}

/*** filter navigation - input=check type and multiple select ***/
var selectedFilterOptions=function(obj){
	var str="";
	if (obj.tagName=='INPUT'){
		jQuery(obj).each(function(){
			if (jQuery(this).is(":checked")){
				 str=str+"Filter/"+jQuery(this).attr('name')+"/"+jQuery(this).val()+"/";
			}
		});
	}else if (obj.tagName=='SELECT'){
		var selectname=jQuery(obj).attr('name');
		jQuery(obj).find('option').each(function(){ 
			if(jQuery(this).is(':selected'))
				str+="Filter/"+selectname+"/"+jQuery(this).val()+"/";
		});
	}
	return str;
}
