/**
 * editor_plugin_src.js
 * 
 * Copyright 2012, Mijura Pty. Ltd. Released under The MIT License.
 * 
 * About:
 * AutoComplete for TinyMCE provides inline autocomplete in a style similar to 
 * Twitter or Facebook.  The text you type in tinyMCE is checked 
 * against a list of specified options; if there is a match then 
 * you will see them appear in a list underneath the caret.  
 * 
 * Configuration:
 * There are four parameters that need to be specified in your tinyMCE config:
 * 1\ autocomplete_delimiters - A CSV list of delimiters (ASCII codes) on which 
 * 		to split text entered into tinyMCE. In most cases you will want to 
 * 		split text by spaces, in which case you would specify '160,32'. 32 is 
 * 		a normal space and 160 is &nbsp; (which is commonly used by tinyMCE). 
 * 		Whichever delimiter you specify first will be inserted after you 
 * 		select an option.  The default is '160,32' for spaces. 
 * 2\ autocomplete_options - A CSV list of autocomplete options.  For 
 * 		example, 'john,jane,jwilliam'.    
 * 3\ autocomplete_trigger -  You can specify a trigger character that must 
 * 		be type immediately before searching for options.  The default 
 * 		trigger is '@'  
 * 4\ autocomplete_end_option - Any text that you want to be added after the 
 * 		option.  The caret will be placed between the option and this ending 
 * 		text.  For example, you could specify 'end', in which case selecting 
 * 		an autocomplete option would insert: '@jane  @end' with the caret 
 * 		placed in between (and including the trigger before the end option).
 * 
 * Support: 
 * You are welcome to use this plugin at your own risk.  It is currently 
 * being maintained on GitHub where you can submit issues / feature requests. 
 */
var xml_file;
(function() {
	var autocomplete_data = {};
	var DOWN_ARROW_KEY = 40;
	var UP_ARROW_KEY = 38;
	var ESC_KEY = 27;
	var ENTER_KEY = 13;
	var MAGIC_DOT = 190; 
	var SEARCH_BY_CLASSNAME = 1;
	var SEARCH_BY_PROPERTIES = 2;
	var last_word="";
	var activeCode = Array();
	
	tinymce.create('tinymce.plugins.AutoCompletePlugin', {
		init : function(ed, url) {
			
			autocomplete_data = {
				list: createOptionList(),
				visible: false,
				cancelEnter: true,
				delimiter: ed.getParam('autocomplete_delimiters', '160,32').split(","),
				//options: ed.getParam('autocomplete_options', '').split(","),
				options : '',
				trigger: ed.getParam('autocomplete_trigger', '['),
				xml_path: ed.getParam('autocomplete_xml_path',''),
				enclosing: ed.getParam('autocomplete_end_option', '')
			};
			getXmlList();
			
			console.log(autocomplete_data);
			/**
			 * Search for autocomplete options after text is entered and display the 
			 * option list if any matches are found. 
			 */
			 
			function keyUpEvent(ed, e) {
			
				if ((!autocomplete_data.visible && e.keyCode != ESC_KEY && e.keyCode != ENTER_KEY) || (e.keyCode != DOWN_ARROW_KEY && e.keyCode != UP_ARROW_KEY && e.keyCode != ENTER_KEY && e.keyCode != ESC_KEY)) {
					var currentWord = getCurrentWord(ed);
					
					var matches = [];
						if (currentWord.length > 0) {
							var wordLessTrigger = currentWord.replace(autocomplete_data.trigger,"");
							console.log('wordless: ' + wordLessTrigger);
							console.log('has dot: ' + hasDot(wordLessTrigger));
							last_word = wordLessTrigger;
							console.log('laswt word: ' + wordLessTrigger);
							matches = matchingOptions(wordLessTrigger);
							console.log(matches);
							if (matches.length > 0) {
								displayOptionList(matches, wordLessTrigger, ed);
								highlightNextOption();
							}
						}
					
					if (currentWord.length == 0 || matches.length == 0) {
						hideOptionList();
					}
				}
			}
			
			/**
			 * Prevent return from adding a new line after selecting an option.  
			 */
			function keyPressEvent(ed, e) {
				console.log('keypress '+ e.keyCode);
				console.log(autocomplete_data.cancelEnter);
				if (e.keyCode == ENTER_KEY && autocomplete_data.cancelEnter) {
					autocomplete_data.cancelEnter = false;
					return tinymce.dom.Event.cancel(e);
				}
			}
			
			/**
			 * Handle navigation inside the option list when it is visible.  
			 * These events should not propagate to the editor. 
			 */
			function keyDownEvent(ed, e) {
				console.log('keydown '+ e.keyCode);
				if (autocomplete_data.visible) {
					if (e.keyCode == DOWN_ARROW_KEY) {
						highlightNextOption();
						return tinymce.dom.Event.cancel(e);
					}
					if (e.keyCode == UP_ARROW_KEY) {
						highlightPreviousOption();
						return tinymce.dom.Event.cancel(e);
					}
					if (e.keyCode == ENTER_KEY) {
						selectOption(ed, getCurrentWord(ed),0);
						autocomplete_data.cancelEnter = true;
						return tinymce.dom.Event.cancel(e);
								// the enter evet needs to be cancelled on keypress so 
								// it doesn't register a carriage return
					}
					if (e.keyCode == MAGIC_DOT) {
						selectOption(ed, getCurrentWord(ed),1);
						autocomplete_data.cancelEnter = true;
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
			}
			
			function clickEvent(ed, e) {
				hideOptionList();
			}

			/**
			 * Add all the options to the option list and display it right beneath 
			 * the caret where the user is entering text. There didn't appear to be 
			 * an easy way to retrieve the exact pixel position of the caret inside 
			 * tinyMCE so the difficult method had to suffice. 
			 */
			function displayOptionList(matches, matchedText, ed) {
				var matchesList = "";
				var s;
				var highlightSearch = "";
				
				if(hasDot(matchedText)){
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
				
				jQuery(autocomplete_data.list).html(matchesList);
				
				// work out the position of the caret
				console.log('ed:');
				console.log(ed.selection.getRng().getClientRects());
				var tinymcePosition = jQuery(ed.getContainer()).position();
				var toolbarPosition = jQuery(ed.getContainer()).find(".mceToolbar").first();
				var nodePosition = jQuery(ed.selection.getNode()).position();
				var textareaTop = 0;
				var textareaLeft = 0;
				if (ed.selection.getRng().getClientRects().length > 0) {
					textareaTop = ed.selection.getRng().getClientRects()[0].top + ed.selection.getRng().getClientRects()[0].height;
					textareaLeft = ed.selection.getRng().getClientRects()[0].left;
				} else {
					textareaTop = parseInt(jQuery(ed.selection.getNode()).css("font-size")) * 1.3 + nodePosition.top;
					textareaLeft = nodePosition.left;
				}
				
				jQuery(autocomplete_data.list).css("margin-top", tinymcePosition.top + toolbarPosition.innerHeight() + textareaTop);
				jQuery(autocomplete_data.list).css("margin-left", tinymcePosition.left + textareaLeft);
				jQuery(autocomplete_data.list).css("display", "block");
				autocomplete_data.visible = true;
				optionListEventHandlers(ed);
			}
			
			/**
			 * Allow a user to select an option by clicking with the mouse and 
			 * highlighting the options on hover. 
			 */
			function optionListEventHandlers(ed) {
				jQuery(autocomplete_data.list).find("li").hover(function() {
					jQuery(autocomplete_data.list).find("[data-selected=true]").attr("data-selected","false");
					jQuery(this).attr("data-selected","true");
				});
				jQuery(autocomplete_data.list).find("li").click(function() {
					selectOption(ed, getCurrentWord(ed));
				});
			}
			
			function getXmlList(){
			 	var xml_temp;
			 	if(autocomplete_data.xml_path){
				 	$.ajax({
						type: "GET",
						url: autocomplete_data.xml_path,
						dataType: "xml",
						success: function(data) {
							autocomplete_data.options = data;
							xml_file = data;
							//console.log(xml_temp);
							//initCodeList(data);
						
						}
					 });
				 }
				 return xml_file;
			 }
			 
			function createOptionList() {
				if(!jQuery('.auto-list').length){
					var ulContainer = document.createElement("ul");
					jQuery(ulContainer).addClass("auto-list");
					jQuery(ulContainer).prop("id","auto-list");
					document.body.appendChild(ulContainer);
					return ulContainer;
				}else{
					return document.getElementById("auto-list");
				}
			}
			
			function hideOptionList() {
				jQuery(autocomplete_data.list).css("display", "none");
				autocomplete_data.visible = false;
			}
			
			function highlightNextOption() {
				var current = jQuery(autocomplete_data.list).find("[data-selected=true]");
				if (current.size() == 0 || current.next().size() == 0) {
					jQuery(autocomplete_data.list).find("li:first-child").attr("data-selected","true");
				} else {
					current.next().attr("data-selected","true");
				}
				current.attr("data-selected","false");
			}
			
			function highlightPreviousOption() {
				var current = jQuery(autocomplete_data.list).find("[data-selected=true]");
				if (current.size() == 0 || current.prev().size() == 0) {
					jQuery(autocomplete_data.list).find("li:last-child").attr("data-selected","true");
				} else {
					current.prev().attr("data-selected","true");
				}
				current.attr("data-selected","false");
			}

			/**
			 * Select/insert the currently selected option.  The option will be inserted at the 
			 * caret position with a delimiter at the end and the option enclosing text.  If the 
			 * enclosing text has already been inserted (this would happen when you are editing 
			 * an autocompleted option), then it won't be inserted again. 
			 */
			function selectOption(ed, matchedText,WITH_DOT) {
				
				var current = jQuery(autocomplete_data.list).find("[data-selected=true]").attr("data-value");
				if (current == null) {
					current = jQuery(autocomplete_data.list).find("li:first-child").attr("data-value");
				}
				
				var content = restOfContent(ed.selection.getSel().anchorNode,"");
				var currentNode = ed.selection.getSel().anchorNode.textContent;
				
				// modify the range to replace overwrite the option text that has already been entered
				var range = ed.selection.getRng();
				range.setStart(range.startContainer, range.startOffset - matchedText.length);
				ed.selection.setRng(range);
				
				// insert the trigger, selected option and following delimiter
				var delim = "";
				if (autocomplete_data.delimiter.length > 0) {
					delim = String.fromCharCode(autocomplete_data.delimiter[0]);
				}
				
				var temp = ""
				
				if(hasDot(last_word)){
					temp = autocomplete_data.trigger + last_word + current;
				}
				else{
					temp = autocomplete_data.trigger + current;
				}
				//console.log('current: '+current);
				ed.selection.setContent(temp);
				//console.log(autocomplete_data.trigger + current + delim);
				// insert the enclosing text if it has not already been added
				if (autocomplete_data.enclosing.length > 0 && !closingTextExists(content, currentNode)) {
					var middleBookmark = ed.selection.getBookmark();
					ed.selection.setContent(delim + autocomplete_data.trigger + autocomplete_data.enclosing);
					ed.selection.moveToBookmark(middleBookmark);					
				}
					hideOptionList();
			}
			
			/**
			 * Check if the enclosing string has already been placed past the current node.  
			 */
			function closingTextExists(content, currentNode) {
				var enclosed = autocomplete_data.trigger + autocomplete_data.enclosing;
				content = content.substr(currentNode.length);
				//console.log(autocomplete_data.trigger + ".{" + autocomplete_data.enclosing.length + "}");
				var matches = new RegExp(autocomplete_data.trigger + ".{" + autocomplete_data.enclosing.length + "}","g").exec(content);
				if (matches != null && matches.length > 0 && matches[0] == enclosed) {
					return true;
				}
				return false;
			}
			
			/**
			 * Recursively find all of the content past (and including) the caret node. 
			 * This doesn't appear to be available any other way.  
			 */
			function restOfContent(anchorNode, content) {
				content += anchorNode.textContent;
				if (anchorNode.nextSibling != null) {
					return restOfContent(anchorNode.nextSibling, content);
				}
				return content; 
			}
			
			/**
			 * Find all options whose beginning matches the currently entered text. 
			 */
			function matchingOptions(currentWord) {
				var options = autocomplete_data.options;
				var matches = [];
				var temp;
				/*for (var i in options) {
					if (currentWord.length == 0 || beginningOfWordMatches(currentWord, options[i])) {
						matches.push(options[i]);
					}
				}*/
				
				
				var x =jQuery(options).find('Class');
					matches = jQuery.grep(x, function (value) {
						  var pattern = new RegExp("^"+currentWord);
						  console.log(jQuery(value).attr('name').match(pattern));
						  if(jQuery(value).attr('name').match(pattern)) return true;
						  return false;
						});
				
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
				
				
				if(hasDot(currentWord)){
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
			}
			
			function hasDot(currentWord){
				var dot = currentWord.match(/\./gi);
				if(dot != null && dot.length == 1){
					return true;
				}
				else
					return false;
			}
			function beginningOfWordMatches(beginning, option) {
				return (option.match("^" + beginning) == beginning);
			}

			/**
			 * Retrieves the 'word' as specified by the first occurrence of a
			 * delimiter prior to the caret position.
			 */
			function getCurrentWord(ed) {
				
				var nodeText = ed.selection.getSel().focusNode == null ? "" : ed.selection.getSel().focusNode.nodeValue;
				console.log('focus node');
				console.log(ed.selection);
				console.log(ed.selection.getSel());
				var positionInNode = ed.selection.getSel().focusOffset;
				if (nodeText == null || nodeText.length == 0) {
					return "";
				}
				var lastDelimiter = 0;
				for (var i = 0; i < positionInNode; i++) {
					if (autocomplete_data.delimiter.indexOf(nodeText.charCodeAt(i).toString()) != -1) {
						lastDelimiter = i+1;
					}
				}
				var word = nodeText.substr(lastDelimiter, positionInNode-lastDelimiter);
				if (word.length > 0 && word.charAt(0).toString() == autocomplete_data.trigger) {
					return word;
				}
				return "";
			}

			ed.onKeyUp.addToTop(keyUpEvent);
			ed.onKeyDown.addToTop(keyDownEvent);
			ed.onKeyPress.addToTop(keyPressEvent);
			ed.onClick.add(clickEvent);
		},

		getInfo : function() {
			return {
				longname : 'AutoComplete',
				author : 'Mijura Pty Ltd',
				authorurl : 'http://mijura.com',
				infourl : 'http://blog.mijura.com',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	tinymce.PluginManager.add('autocomplete',
			tinymce.plugins.AutoCompletePlugin);
})();
