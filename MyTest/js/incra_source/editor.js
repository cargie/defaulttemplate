jQuery.fn.extend({
	incraEditor	:	function(config){
		var textarea = jQuery(this);
		textarea.wrap('<div id="incra_editor" class="incra_editor"><div class="workarea">');
		jQuery('.incra_editor').prepend('<div class="toolbar">');
		jQuery('.workarea').prepend('<div contenteditable="true" class="'+ textarea.attr('id') +'">');
		
		textarea.hide();
		
	}
});
