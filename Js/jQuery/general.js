jQuery(document).ready(function(){

	/*****pop-up*****/

	jQuery('ul#toplinks li').live('mouseover mouseout', function(event) {
		if (event.type == 'mouseover') {
			jQuery(this).children('.incra-dropdown-menu').css('display','block');
		} else {
			jQuery(this).children('.incra-dropdown-menu').css('display','none');
		}
	
	});
	
})

/* set password */
 var setPasswordForm=function(arg){
	
        if (arg){
            jQuery('#change-password').show();
            jQuery('#current_password').addClass('required');
            jQuery('#password').addClass('required');
            jQuery('#confirmation').addClass('required');

        }else{
            jQuery('#change-password').hide();
            jQuery('#current_password').removeClass('required');
            jQuery('#password').removeClass('required');
            jQuery('#confirmation').removeClass('required');
        }
 }
 
 /* validate form check required fields */
 var INCRAFORM = {
 	validateFormFields	:	function(){
 		var fields = jQuery("form .input-text.required");
 		fields.each(function(){
 			if(jQuery(this).val() == ""){
 				jQuery("#advice-required-entry-"+jQuery(this).prop("id")).remove();
				jQuery(this).addClass("validation-failed");
 				var noticed = jQuery('<div class="validation-advice" id="advice-required-entry-'+jQuery(this).prop("id")+'" style="display:none">');
 				noticed.html('This is a required field.');
 				noticed.insertAfter(jQuery(this));
 			}else{
 				jQuery(this).removeClass("validation-failed");
 				jQuery("#advice-required-entry-"+jQuery(this).prop("id")).remove();
 			}
 		});
 		jQuery(".validation-advice").fadeIn(1000);
 		if(jQuery("form .validation-advice").length == 0)
 			return true;
 		else
 			return false;
 	},
 	
 }

