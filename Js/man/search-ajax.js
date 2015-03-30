  $(document).ready(function(){
		 var default_value = 'find replacer...';
	      	$('.default-value').each(function() {
		   
		    $(this).focus(function() {
			if(this.value == default_value) {
			    this.value = '';
			}
		    });
		    $(this).blur(function() {
			if(this.value == '') {
			    this.value = default_value;
			}
		    });
		});
		
		
		$(window).keydown(function(event){
		    if(event.keyCode == 13) {
		      event.preventDefault();
		      return false;
		    }
		  });
		
		$("#findreplacer").keypress(function(event) {
		    if ( event.which == 13 ) {
			 var value = $('#findreplacer').val();
			if (value==''){
				return false;
			}else{
			 	$("#button-search").click();
			}	
		   }	 
		});
		$("#button-search").click(function() {
			
			 var value = $('#findreplacer').val();
			var searchmode= $("input:radio:checked").val();
			if (value==default_value){
				return false;
			}
			
			//window.location="http://linux:8000/man/"+searchmode+"/"+value;
		});
		$("#findreplacer").keyup(function(){
			var str = $('#findreplacer').val();
			var searchmode= $("input:radio:checked").val();
			if (str.length==0)
			  { 
			  document.getElementById("livesearch").innerHTML="";
			  document.getElementById("livesearch").style.display="none";
			  return;
			  }
			if (window.XMLHttpRequest)
			  {// code for IE7+, Firefox, Chrome, Opera, Safari
			  xmlhttp=new XMLHttpRequest();
			  }
			else
			  {// code for IE6, IE5
			  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			  }
			xmlhttp.onreadystatechange=function()
			  {
			  if (xmlhttp.readyState==4 && xmlhttp.status==200)
			    {
	
				document.getElementById("livesearch").innerHTML=xmlhttp.responseText;
				document.getElementById("livesearch").style.display="block";
			    }
			  }
		
			xmlhttp.open("GET","http://linux:8000/man/"+searchmode+"AjaxSearch/"+str,true);
			xmlhttp.send();
		});
		
     });

function ClearTextSearch(){
	
	  document.getElementById("findreplacer").value="find replacer...";
	  document.getElementById("livesearch").innerHTML="";
	  document.getElementById("livesearch").style.display="none";
}
