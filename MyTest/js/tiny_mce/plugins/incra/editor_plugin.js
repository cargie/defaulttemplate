var code;
var anticipate = false;
var xml;
var activeText = "";
(function(){
	tinymce.PluginManager.add('incra', function(editor){
		$.ajax({
		    type: "GET",
		    url: "incralist.xml",
		    dataType: "xml",
		    success: function(data) {
		    	xml = jQuery(data);
		    	//console.log(data);
		    	//initCodeList(data);
		    }
		 });
		 editor.onKeyDown.add(function(ed, e) {
		 	console.log(window.getSelection().anchorOffset);
		 	if(e.which == 16) return;

		 	//console.log(e.which);
		 	//console.log(e.keyCode);

		 	
		 	if(e.which == 219){
		 		anticipate = true;
		 		jQuery("#incra_intellisense").css('display','block');
		 		var data = renderAllResult();
		 		
		 		jQuery("#incra_intellisense").html(data);
		 		
		 	}else{
		 		activeText += String.fromCharCode(e.which);
		 		var data = renderResult('class',activeText);
		 		//console.log('else');
		 		//console.log(data);
		 		jQuery("#incra_intellisense").html(data);
		 	}
            //console.log('Key down event: ' + String.fromCharCode(e.which));
            
      	});
	});
	
	initCodeList = function(allText) {
		var record_num = 5;  // or however many elements there are in each row
		var allTextLines = allText.split(/\r\n|\n/);
		
		var lines = [];
		var json = [];
		allTextLines.forEach(function(el){
			var entries = el.split(',');
			var temp = Object();
			temp.className = entries[0];
			temp.Property = entries[1];
			temp.desc = entries[2];
			json.push(temp);
		});
		x = json;
		//console.log(json);
		return;
	}
	
	getMatchResult = function(level,search_value){
		var val = search_value;
		var x = xml.find('Class');
		var temp = [];
		var result = jQuery.grep(x, function (value) {
			  var pattern = new RegExp("^"+val,'gi');
		      console.log(pattern);
		      if(jQuery(value).attr('name').match(pattern)) return true;
		      return false;
		    }
		 );
		 return result;
	}
	
	renderResult = function(level,value){
		var data = getMatchResult(level,value);
		//console.log(data);
		var html = "";
		//console.log('length : '+ data.length)
		if(data.length > 0){
			html = '<ul>';
				data.forEach(function(el){
					html += '<li>' + jQuery(el).attr('name') + '</li>';
				});
			html += '</ul>';
		}
		return html;
	}
	renderAllResult = function(level,value){
		var html = "";
		if(xml.find('Class').length > 0){
			html = '<ul>';
				xml.find('Class').each(function(){
					html += '<li>' + jQuery(this).attr('name') + '</li>';
				});
			html += '</ul>';
		}
		return html;
	}
})();
