var DOWN_ARROW_KEY = 40;
var UP_ARROW_KEY = 38;
var ESC_KEY = 27;
var ENTER_KEY = 13;
var MAGIC_DOT = 190; 
var SEARCH_BY_CLASSNAME = 1;
var SEARCH_BY_PROPERTIES = 2;

jQuery.fn.extend({
    incra     :     function(config){
        var default_config = {
            list     :     [],
            visible  : false,
            cancelEnter : true,
            delimiter : '160,32'.split(","),
            options   :  '',
            xml_file  : []    
        };
        var config = jQuery.extend(default_config,config);
        
        //Methods to be used
        var incraMethods = {
            createOptionList : function(){
                 if(!jQuery('.auto-list').length){
					var ulContainer = jQuery('<ul id="auto-list" class="auto-list">');
					jQuery('body').append(ulContainer);
					return ulContainer;
				}else{
					return document.getElementById("auto-list");
				} 
            },
            getXmlList	:	function(path){
			 	var xml_file;
			 	if(path){
				 	jQuery.ajax({
						type: "GET",
						url: path,
						dataType: "xml",
						success: function(data) {
							config.xml_file = data;
						}
					 });

				 } 
			 },
			keyUpEvent 	:	function(e) {
				if ((!config.visible && e.keyCode != ESC_KEY && e.keyCode != ENTER_KEY) || (e.keyCode != DOWN_ARROW_KEY && e.keyCode != UP_ARROW_KEY && e.keyCode != ENTER_KEY && e.keyCode != ESC_KEY)) {
					console.log('keyup');
					console.log(e.keyCode);
					var currentWord = incraMethods.getCurrentWord();
				}
			},
			keyPressEvent 	:	function() {
				console.log('keypress');
			},
			keyDownEvent 	:	function() {
				console.log('keydown');
			},
			getCurrentWord  :   function(){
				console.log('current word');
			}
		}
		
		//Applying to all instances
        this.each(function(){
            console.log(config);
            incraMethods.createOptionList();
		    incraMethods.getXmlList(config.xml_path);
		    console.log(config);
		    
		    jQuery(this).bind('keyup',incraMethods.keyUpEvent);
		    jQuery(this).bind('keypress',incraMethods.keyPressEvent);
		    jQuery(this).bind('keydown',incraMethods.keyDownEvent);
        });
       
        return this;
    },
   
});


