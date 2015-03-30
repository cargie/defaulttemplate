$j(document).ready(function(){
	
	var watermark = 'Search entire store here';
 
	//init, set watermark text and class
	$j('#product-search').val(watermark).addClass('watermark');
 
	//if blur and no value inside, set watermark text and class again.
 	$j('#product-search').blur(function(){
  		if ($j(this).val().length == 0){
    		$j(this).val(watermark).addClass('watermark');
		}
 	});
 
	//if focus and text is watermrk, set it to empty and remove the watermark class
	$j('#product-search').focus(function(){
  		if ($j(this).val() == watermark){
    		$j(this).val('').removeClass('watermark');
		}
 	});
	/*
	$j(window).keydown(function(event){
	    if(event.keyCode == 13) {
	      event.preventDefault();
	      return false;
	    }
	  });
	
	$j("#product-search").keypress(function(event) {
	    if ( event.which == 13 ) {
		 var value = $j('#product-search').val();
		if (value==''){
			return false;
		}else{
		 	$j("#search_button").click();
		}	
	   }	 
	});*/
	$j("#search_button").click(function() {
		
		 var value = $j('#product-search').val();
		
		if (value==default_value){
			return false;
		}
		
		window.location="http://linux:8000/base/Search/Text/"+value;
	});
	/*
	$j("#product-search").keyup(function(){
		var str = $j('#product-search').val();
		
		if (str.length==0)
		  { 
		  document.getElementById("search_autocomplete").innerHTML="";
		  document.getElementById("search_autocomplete").style.display="none";
		  return;
		  }
		
		var url="http://linux:8000/base/Search/Ajax/"+str;
		
		jQuery.ajax(url,{	
		  type: "GET",  
		  dataType: "html",
		  cache: true, 
		  success: function(data, textStatus, jqXHR){	
		  	
				document.getElementById("search_autocomplete").innerHTML=data;
				document.getElementById("search_autocomplete").style.display="block";		
			}
		});
	});*/
	
	
});


