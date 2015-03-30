var DOWN_ARROW_KEY = 40;
var UP_ARROW_KEY = 38;
var ESC_KEY = 27;
var ENTER_KEY = 13;
var MAGIC_DOT = 190; 
var SEARCH_BY_CLASSNAME = 1;
var SEARCH_BY_PROPERTIES = 2;
var xml_file;
(function($) {
	$.Class("IncraAutoComplete",
		{
			
		},
		{	
			autocomplete_data : {},
			list 		: [],
			visible		: false,
			cancelEnter	: true,
			delimiter	: '160,32'.split(","),
			options 	: '',
			trigger		: '[',
			xml_path	: '/incra_class_list.xml',
			enclosing	: '',
			xml_file	:	[],
			init	:	function(id){
				this.autocomplete_data = {
					list: this.createOptionList(),
					visible: false,
					cancelEnter: true,
					delimiter: '160,32'.split(","),
					options : '',
					trigger: '[',
					xml_path: '/incra_class_list.xml',
					enclosing: ''
				};
				
				this.createOptionList();
				this.autocomplete_data.options = this.getXmlList();
				jQuery('#example_1').bind('keyup',jQuery.proxy(function(e){ this.keyUpEvent('example_1',e) },this));
				jQuery('#example_1').bind('keydown',jQuery.proxy(function(e){ this.keyDownEvent('example_1',e) },this));
				jQuery('#example_1').bind('keypress',jQuery.proxy(function(e){ this.keyPressEvent('example_1', e) },this));
				
			},
			
			getXmlList	:	function(){
			 	var xml_file;
			 	if(this.autocomplete_data.xml_path){
				 	$.ajax({
						type: "GET",
						url: this.autocomplete_data.xml_path,
						dataType: "xml",
						success: jQuery.proxy(function(data) {
							xml_file = data;
							this.autocomplete_data.options = xml_file;

						},this)
					 });

				 } 
				 return xml_file;
			 },
			 createOptionList	:	function() {
			 	if(!jQuery('.auto-list').length){
					var ulContainer = document.createElement("ul");
					jQuery(ulContainer).addClass("auto-list");
					jQuery(ulContainer).prop("id","auto-list");
					document.body.appendChild(ulContainer);
					return ulContainer;
				}else{
					return document.getElementById("auto-list");
				}
			},
			keyUpEvent 	:	function(ed, e) {
				
				if ((!this.autocomplete_data.visible && e.keyCode != ESC_KEY && e.keyCode != ENTER_KEY) || (e.keyCode != DOWN_ARROW_KEY && e.keyCode != UP_ARROW_KEY && e.keyCode != ENTER_KEY && e.keyCode != ESC_KEY)) {
					
					var currentWord = this.getCurrentWord(ed);
					console.log('current word: ' + currentWord);
					var matches = [];
						if (currentWord.length > 0) {
							var wordLessTrigger = currentWord.replace(this.autocomplete_data.trigger,"");
							console.log('wordless: ' + wordLessTrigger);
							console.log('has dot: ' + this.hasDot(wordLessTrigger));
							last_word = wordLessTrigger;
							console.log('laswt word: ' + wordLessTrigger);
							matches = this.matchingOptions(wordLessTrigger);
							console.log(matches);
							if (matches.length > 0) {
								this.displayOptionList(matches, wordLessTrigger, ed);
								this.highlightNextOption();
							}
						}
					
					if (currentWord.length == 0 || matches.length == 0) {
						this.hideOptionList();
					}
				}
			},
			/**
			 * Retrieves the 'word' as specified by the first occurrence of a
			 * delimiter prior to the caret position.
			 */
			getCurrentWord2 	:	function (ed) {
				
				ed = window.getSelection();
				console.log(ed);
				var nodeText = ed.focusNode == null ? "" : ed.focusNode.nodeValue;
				
				var positionInNode = ed.focusOffset;
				if (nodeText == null || nodeText.length == 0) {
					return "";
				}
				var lastDelimiter = 0;
				for (var i = 0; i < positionInNode; i++) {
					if (this.autocomplete_data.delimiter.indexOf(nodeText.charCodeAt(i).toString()) != -1) {
						lastDelimiter = i+1;
					}
				}
				var word = nodeText.substr(lastDelimiter, positionInNode-lastDelimiter);
				if (word.length > 0 && word.charAt(0).toString() == this.autocomplete_data.trigger) {
					return word;
				}
				return "";
			},
			getCurrentWord 	:	function (ed) {
				
				ed = window.getSelection();
				console.log(ed);
				
				var sel = this.getSelection('example_1');
				var nodeText = ed.focusNode == null ? "" : jQuery('#example_1').val();
				console.log('nodeText: ' + nodeText);
				//var positionInNode = ed.focusOffset;
				var positionInNode = sel.end;
				if (nodeText == null || nodeText.length == 0) {
					return "";
				}
				console.log('positionInNode: ' + positionInNode);
				var lastDelimiter = 0;
				for (var i = 0; i < positionInNode; i++) {
					if (this.autocomplete_data.delimiter.indexOf(nodeText.charCodeAt(i).toString()) != -1) {
						lastDelimiter = i+1;
					}
				}
				var word = nodeText.substr(lastDelimiter, positionInNode-lastDelimiter);
				console.log('word: ' + word);
				console.log('wordlength: ' + word.length);
				console.log('trigger:' + word.charAt(0).toString());
				console.log('data.trigger:' + this.autocomplete_data.trigger);
				if (word.length > 0 && word.charAt(0).toString() == this.autocomplete_data.trigger) {
					return word;
				}
				return "";
			},
			hideOptionList	:	function () {
				jQuery(this.autocomplete_data.list).css("display", "none");
				this.autocomplete_data.visible = false;
			},
			highlightNextOption : function() {
				var current = jQuery(this.autocomplete_data.list).find("[data-selected=true]");
				if (current.size() == 0 || current.next().size() == 0) {
					jQuery(this.autocomplete_data.list).find("li:first-child").attr("data-selected","true");
				} else {
					current.next().attr("data-selected","true");
				}
				current.attr("data-selected","false");
			},
			
			highlightPreviousOption	:	function() {
				var current = jQuery(autocomplete_data.list).find("[data-selected=true]");
				if (current.size() == 0 || current.prev().size() == 0) {
					jQuery(autocomplete_data.list).find("li:last-child").attr("data-selected","true");
				} else {
					current.prev().attr("data-selected","true");
				}
				current.attr("data-selected","false");
			},
			selectOption	:	function(ed, matchedText,WITH_DOT) {
				
				var current = jQuery(this.autocomplete_data.list).find("[data-selected=true]").attr("data-value");
				if (current == null) {
					current = jQuery(this.autocomplete_data.list).find("li:first-child").attr("data-value");
				}
				
				var content = this.restOfContent(window.getSelection().anchorNode,"");
				var currentNode = window.getSelection().anchorNode.textContent;
				console.log(content);
				console.log('matched text'+matchedText);
				// modify the range to replace overwrite the option text that has already been entered
				var range = window.getSelection().getRangeAt();
				range.setStart(range.startContainer, range.startOffset - matchedText.length);
				window.getSelection().addRange(range);
				
				// insert the trigger, selected option and following delimiter
				var delim = "";
				if (this.autocomplete_data.delimiter.length > 0) {
					delim = String.fromCharCode(this.autocomplete_data.delimiter[0]);
				}
				
				var temp = ""
				
				if(this.hasDot(last_word)){
					temp = this.autocomplete_data.trigger + last_word + current;
				}
				else{
					temp = this.autocomplete_data.trigger + current;
				}
				console.log(temp);
				//console.log('current: '+current);
				document.getSelection().setContent(temp);
				//console.log(autocomplete_data.trigger + current + delim);
				// insert the enclosing text if it has not already been added
				/*if (this.autocomplete_data.enclosing.length > 0 && !this.closingTextExists(content, currentNode)) {
					var middleBookmark = window.getSelection().getBookmark();
					window.getSelection().setContent(delim + this.autocomplete_data.trigger + this.autocomplete_data.enclosing);
					window.getSelection().moveToBookmark(middleBookmark);					
				}*/
					this.hideOptionList();
			},
			
			/**
			 * Check if the enclosing string has already been placed past the current node.  
			 */
			closingTextExists	:	function(content, currentNode) {
				var enclosed = this.autocomplete_data.trigger + this.autocomplete_data.enclosing;
				content = content.substr(currentNode.length);
				//console.log(autocomplete_data.trigger + ".{" + autocomplete_data.enclosing.length + "}");
				var matches = new RegExp(this.autocomplete_data.trigger + ".{" + this.autocomplete_data.enclosing.length + "}","g").exec(content);
				if (matches != null && matches.length > 0 && matches[0] == enclosed) {
					return true;
				}
				return false;
			},
			
			/**
			 * Recursively find all of the content past (and including) the caret node. 
			 * This doesn't appear to be available any other way.  
			 */
			restOfContent	:	function(anchorNode, content) {
				content += anchorNode.textContent;
				if (anchorNode.nextSibling != null) {
					return restOfContent(anchorNode.nextSibling, content);
				}
				return content; 
			},
			
			/**
			 * Find all options whose beginning matches the currently entered text. 
			 */
			matchingOptions	:	function(currentWord) {
				var options = this.autocomplete_data.options;
				var matches = [];
				var temp;
				console.log('matching options');
				/*for (var i in options) {
					if (currentWord.length == 0 || beginningOfWordMatches(currentWord, options[i])) {
						matches.push(options[i]);
					}
				}*/
				
				console.log('options:');
				console.log(this.autocomplete_data);
				var x =jQuery(options).find('Class');
					matches = jQuery.grep(x, function (value) {
						  var pattern = new RegExp("^"+currentWord);
						  console.log(jQuery(value).attr('name').match(pattern));
						  if(jQuery(value).attr('name').match(pattern)) return true;
						  return false;
						});
				console.log('matches:' + matches);
				/*	console.log(SEARCH_OPTIONS.search_by);
					matches = jQuery.grep(x, function (value) {
						  var pattern = new RegExp("^"+SEARCH_OPTIONS.class_name);
						  console.log(jQuery(value).attr('name').match(pattern));
						  if(jQuery(value).attr('name').match(pattern)) return true;
						  return false;
						});
					xml_file = jQuery(matches).children('Property');
					matches = jQuery(matches).children('Property');
				*/
				
				
				if(this.hasDot(currentWord)){
					var s = currentWord.split('.');
					
					temp = jQuery.grep(x, function (value) {
						  var pattern = new RegExp("^"+s[0]);
						  if(jQuery(value).attr('name').match(pattern)) return true;
						  return false;
						});
					
					if(s[1]==""){
						matches = jQuery(temp).children('Property');
						console.log(matches);
					}else{
						var prop = jQuery(temp).children('Property');
						console.log('s:'+s[1]);
						
						xml_file = temp;
						matches =jQuery.grep(prop, function (value) {
							  var pattern = new RegExp("^"+s[1]);
							  console.log(jQuery(value).attr('name').match(pattern));
							  if(jQuery(value).attr('name').match(pattern)) return true;
							  return false;
						  });
					}
					console.log(s);
				}
				return matches;
			},
			
			hasDot	:	function (currentWord){
				var dot = currentWord.match(/\./gi);
				if(dot != null && dot.length == 1){
					return true;
				}
				else
					return false;
			},
			beginningOfWordMatches	:	function (beginning, option) {
				return (option.match("^" + beginning) == beginning);
			},
			keyPressEvent	:	function(ed, e) {
				//console.log('keypress '+ e.keyCode);
				//console.log(this.autocomplete_data.cancelEnter);
				if (e.keyCode == ENTER_KEY && this.autocomplete_data.cancelEnter) {
					this.autocomplete_data.cancelEnter = false;
					return tinymce.dom.Event.cancel(e);
				}
			},
			
			/**
			 * Handle navigation inside the option list when it is visible.  
			 * These events should not propagate to the editor. 
			 */
			keyDownEvent	:	function (ed, e) {
				//console.log('keydown '+ e.keyCode);
				if (this.autocomplete_data.visible) {
					if (e.keyCode == DOWN_ARROW_KEY) {
						this.highlightNextOption();
						return tinymce.dom.Event.cancel(e);
					}
					if (e.keyCode == UP_ARROW_KEY) {
						this.highlightPreviousOption();
						return tinymce.dom.Event.cancel(e);
					}
					if (e.keyCode == ENTER_KEY) {
						selectOption(ed, getCurrentWord(ed),0);
						this.autocomplete_data.cancelEnter = true;
						return tinymce.dom.Event.cancel(e);
								// the enter evet needs to be cancelled on keypress so 
								// it doesn't register a carriage return
					}
					if (e.keyCode == MAGIC_DOT) {
						selectOption(ed, getCurrentWord(ed),1);
						this.autocomplete_data.cancelEnter = true;
						//return tinymce.dom.Event.cancel(e);
						//return tinymce.dom.Event.cancel(e);
								// the enter evet needs to be cancelled on keypress so 
								// it doesn't register a carriage return
					}
					if (e.keyCode == ESC_KEY) {
						hideOptionList();
						return tinymce.dom.Event.cancel(e);
					}
				}
			},
			
			clickEvent	:	function (ed, e) {
				hideOptionList();
			},
			getSelection	:	function (the_id)
			{
				var e = document.getElementById(the_id);

				//Mozilla and DOM 3.0
				if('selectionStart' in e)
				{
					var l = e.selectionEnd - e.selectionStart;
					return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l),data : e.value };
				}
				//IE
				else if(document.selection)
				{
					e.focus();
					var r = document.selection.createRange();
					var tr = e.createTextRange();
					var tr2 = tr.duplicate();
					tr2.moveToBookmark(r.getBookmark());
					tr.setEndPoint('EndToStart',tr2);
					if (r == null || tr == null) return { start: e.value.length, end: e.value.length, length: 0, text: '',data : e.value };
					var text_part = r.text.replace(/[\r\n]/g,'.'); //for some reason IE doesn't always count the \n and \r in the length
					var text_whole = e.value.replace(/[\r\n]/g,'.');
					var the_start = text_whole.indexOf(text_part,tr.text.length);
					return { start: the_start, end: the_start + text_part.length, length: text_part.length, text: r.text,data : e.value };
				}
				//Browser not supported
				else return { start: e.value.length, end: e.value.length, length: 0, text: '',data : e.value };
			},
			displayOptionList 	: 	function (matches, matchedText, ed) {
				var matchesList = "";
				var s;
				var highlightSearch = "";
				
				if(this.hasDot(matchedText)){
					s = matchedText.split('.');
					highlightSearch = s[1];
				}else{
					highlightSearch = matchedText;
				}
				
				var highlightRegex = new RegExp("(" + highlightSearch + ")");
				console.log('highlight regex');
				console.log(highlightRegex);
				
				/*for (var i in matches) {
					matchesList += "<li data-value='" + matches[i] + "'>" + matches[i].replace(highlightRegex,"<mark>$1</mark>") + "</li>";
				}*/
				
				jQuery(matches).each(function(index,el){
					
					var n = jQuery(el).attr('name');
					matchesList += "<li data-value='" + n + "' title='"+jQuery(el).attr('desc')+"'>" + n.replace(highlightRegex,"<mark>$1</mark>") + "</li>";
				});
				
				jQuery('.auto-list').html(matchesList);
				
				// work out the position of the caret
				var tinymcePosition = jQuery('#example_1').position();
				var toolbarPosition = jQuery('#example_1').find(".mceToolbar").first();
				var nodePosition = jQuery('#example_1').position();
				var textareaTop = 0;
				var textareaLeft = 0;
				
				if (document.getElementById('example_1').getClientRects().length > 0) {
					textareaTop = document.getElementById('example_1').getClientRects()[0].top + document.getElementById('example_1').getClientRects()[0].height;
					textareaLeft = document.getElementById('example_1').getClientRects()[0].left;
				} else {
					textareaTop = parseInt(jQuery(ed.selection.getNode()).css("font-size")) * 1.3 + nodePosition.top;
					textareaLeft = nodePosition.left;
				}
				console.log(document.getElementById('example_1').getClientRects());
				console.log('textareaTop : ' + textareaTop);
				console.log('textareaLeft : ' + textareaLeft);
				
				var rects = document.getElementById('auto-list').getClientRects();
            	var lastRect = rects;
            	console.log('last Rect');
            	console.log(rects);
            	var top = lastRect.top - document.getElementById('example_1').scrollTop;
            	var left = lastRect.left+lastRect.width;
            	
				//jQuery('.auto-list').css("margin-top", tinymcePosition.top + toolbarPosition.innerHeight() + textareaTop);
				//jQuery('.auto-list').css("margin-left", tinymcePosition.left + textareaLeft);
				var s = this.getSelection('example_1');
				console.log('top: ' + top);
				console.log('left: ' + left);
				//jQuery('.auto-list').css("top", top);
				var row = jQuery('#example_1').val().split('\n').length;
				jQuery('.auto-list').css("top",jQuery('#example_1').position().top +  (24 * row) + 'px');
				jQuery('.auto-list').css("left",(8 * s.end) + 15);
				jQuery('.auto-list').css("position", 'absolute');
				
				jQuery('.auto-list').css("display", "block");
				this.autocomplete_data.visible = true;
				this.optionListEventHandlers(ed);
			},
			optionListEventHandlers		:	function (ed) {
				jQuery('.auto-list').find("li").hover(jQuery.proxy(function() {
					jQuery('.auto-list').find("[data-selected=true]").attr("data-selected","false");
					jQuery(this).attr("data-selected","true");
				},this));
				jQuery('.auto-list').find("li").click(jQuery.proxy(function() {
					this.selectOption(ed, this.getCurrentWord(ed));
				},this));
			}
		}
	)
})(jQuery);


