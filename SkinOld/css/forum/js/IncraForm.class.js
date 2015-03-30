(function( $ ) {
	$.Class("IncraForm",
		{
			
		},
		{
			form_id					:	"",
			save_url				:	"",
			save_and_continue_url	:	"",
			is_save_and_continue	:	false,
			reset_url				:	"",
			delete_url				:	"",
			isEdit					:	false,
			tabs					:	{},
			validation_passed		:	false,
			callback				:	{
											before_validatation	:	function(){},
											after_validatation	:	function(){},
											before_submit		:	function(){}
										},
			
			init		:		function(form_id,save_url,save_and_continue_url,delete_url){
									this.form_id  = form_id;
									this.save_url = save_url;
									this.save_and_continue_url = save_and_continue_url;
									
										jQuery('#'+this.form_id+' .input-text').each(function() {
											console.log(jQuery(this));
											if(jQuery(this).attr("name") != undefined){
												//console.log(jQuery(this).attr("name") + " = " + this.value)
												jQuery(this).data('original', this.value);
											}
										});

										//Binding a function on blur event
										jQuery('#'+this.form_id+' .input-text').bind('blur, change',function(){
											if(jQuery(this).attr("name") != undefined){
												console.log("binding");
												if(jQuery(this).data('original')!=this.value){
													jQuery(".tab-item-link.active").addClass("changed");
												}
											}
										});
										jQuery('#'+this.form_id+' select').mouseup(function(){
											if(jQuery(this).data('original')!=this.value){
												jQuery(".tab-item-link.active").addClass("changed");
											}
										});
								},
			saveAndContinueEdit	:	function(){
								this.is_save_and_continue = true;
								this.submit();
							},
			submit		:		function(){
									
									var form = jQuery('<form action="'+this.save_url+'" method="post">');
									
									if(typeof this.callback.before_validatation == 'function'){
											this.callback.before_validatation(this);
									}
									
									if(this.validateFields()){
										this.is_save_and_continue = false;
										return;
									}
									if(typeof this.callback.after_validatation == 'function'){
										this.callback.after_validatation(this);
									}
									
									if(jQuery("input[name=id]")!= undefined && jQuery("input[name=id]").val()!= 0){
										var data_to_submit = {};
										
										if(this.is_save_and_continue){
											var tab_params="";
											if(jQuery('.tab-item-link.active').length){
												tab_params= '/tab/'+jQuery('.tab-item-link.active').attr('id')+'/';
											}
											this.is_save_and_continue = false;
											if(this.validation_passed){
												jQuery('#'+this.form_id).attr('action',this.save_and_continue_url+tab_params);
												jQuery('#'+this.form_id).submit();
											}
										}
										else{
											if(this.validation_passed){
												jQuery('#'+this.form_id).submit();
											}
										}
										
										if(typeof this.callback.before_submit == 'function'){
											this.callback.before_submit(form);
										}
										
									}
									else{
										if(typeof this.callback.before_submit == 'function'){
											this.callback.before_submit(jQuery('#'+this.form_id));
										}
										
										if(this.is_save_and_continue){
											var tab_params="";
											if(jQuery('.tab-item-link.active').length){
												tab_params= '/tab/'+jQuery('.tab-item-link.active').attr('id')+'/';
											}
											this.is_save_and_continue = false;
											jQuery('#'+this.form_id).attr('action',this.save_and_continue_url+tab_params);
											console.log(this.validation_passed);
											if(this.validation_passed){
												jQuery('#'+this.form_id).submit();
											}
										}
										else{
											console.log(this.validation_passed);
											if(this.validation_passed){
												jQuery('#'+this.form_id).submit();
											}
										}
									}
								},
			validateFields	:	function(){
									var temp = "";
									
									var tabs = Array();
									
									jQuery("#"+this.form_id+" .required-entry").each(function(index,el){
										var advice = '<div class="validation-advice" id="advice-required-entry-'+ jQuery(this).prop('id') +'" style="display:none">This is a required field.</div>';
										if(jQuery(el).val() == ""){
											if(jQuery(el).hasClass('validation-failed')){
												temp += "1";
											}
											else{
												jQuery(el).addClass("validation-failed");
												console.log(jQuery(el));
												console.log(jQuery(el).parent());
												jQuery(advice).appendTo(jQuery(el).parent()).fadeIn(500);
												temp += "1";
											}
											tabs.push(jQuery(el).attr("name"));
										}else{
											jQuery('#advice-required-entry-'+ jQuery(el).prop('id')).remove();
											jQuery(el).removeClass("validation-failed");
										}
									});
									
									/*	jQuery('#'+this.form_id+' .input-text,#'+this.form_id+' select').each(function(){
											var advice = '<div class="validation-advice" id="advice-required-entry-'+ jQuery(this).prop('id') +'" style="display:none">This is a required field.</div>';
											if(jQuery(this).attr("name") != undefined){
												if(jQuery(this).hasClass('required-entry')){
													if(jQuery(this).val() == ""){
														if(jQuery(this).hasClass('validation-failed')){
															temp += "1";
														}
														else{
															jQuery(this).addClass("validation-failed");
															jQuery(advice).appendTo(jQuery(this).parent()).fadeIn(500);
															temp += "1";
														}
														tabs.push(jQuery(this).attr("name"));
													}else{
														jQuery('#advice-required-entry-'+ jQuery(this).prop('id')).remove();
														jQuery(this).removeClass("validation-failed");
													}
												}
											}
										});
										*/
									
									if(temp){
										console.log(tabs);
										
										
										jQuery("#page_tabs .tab-item-link").each(function(){
										var id = jQuery(this).attr("id");
										console.log("#"+id+"_content .validation-advice");
										if(jQuery("#"+id+"_content .validation-advice").length){
											jQuery(this).removeClass("changed").addClass("error");
											}
										});
										this.validation_passed = false;
										return true;
									}
									else{
										this.validation_passed = true;
										return false;
									}
								}
			
		}
	)
})(jQuery);
