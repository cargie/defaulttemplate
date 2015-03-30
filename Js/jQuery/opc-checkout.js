var aris=[];
(function($) {
	$.Class("OnePageCheckOut",
		{
		},
		{
			checkout_method		:	"",
			method_url			:	"",
			shippng_url			:	"",
			billing_url			:	"",
			payment_url			:	"",
			order_url			:	"",
			error_url			:	"",
			country_config_url 	: 	'',
			loading_block 		: 	"one-page-checkout-loading",
			waiting				:	false,
			steps				:	['login', 'billing', 'shipping', 'shipping_method', 'payment', 'review'],
			current_step		:	"login",
			
			
			config	:	{
									load_waiting 	:	function (){},
									shipping_saved	:	function (){},
									billing_saved	:	function (){},
									payment_saved	:	function (){},
								},
			
			init	:	function(_config){
							//this.steps = "billing";
							jQuery.extend(this.config,_config);
						},
			ajaxFailure: function(){
        					location.href = this.failureUrl;
    					},
    		updateProgressBlock: function(responseText){
    								var data = eval(responseText);
    								var me = this;
    								
    								/*
    								data.forEach(function(el,index){
    									
    									if(index==0){
    										console.log('insert content at index: '+index);
    										console.log("#opc-"+me.current_step+" .content ."+me.current_step+"-info-form");
    										jQuery("#opc-"+me.current_step+" .content ."+me.current_step+"-info-form").html(data.Content);
    									}
    									if(index == data.length-1){
    										console.log('insert content at index: '+index);
    										console.log(jQuery(".progress-block."+me.current_step));
    										jQuery(".progress-block."+me.current_step).html(el.Content);
    									}
    								});

    								console.log(jQuery(".progress-block ."+me.current_step));
    								*/

    								
    								data.forEach(function(d,index){
    									
    									var location= d.Location;
    									var current_object = jQuery("body");
    									var current_el;
    									
    									location.forEach(function(l){
    										
    										var pos = l;
    									
											current_el=current_object.children("div").slice(pos - 1,pos);
											current_object = current_object.children("div").slice(pos - 1,pos);

											if(current_object.size()==0){
												current_object=jQuery(current_el).children('div');
											}
											
    									});

    								});
									
    								
    					},
			loading 	:	function(step){
							this.wait = true;
							jQuery("#"+step+"-please-wait").css('display','block');
						},
			doneLoading : function(step){
							jQuery("#"+step+"-please-wait").css('display','none');
							this.wait = false;
						},
			gotoSection : function(step){
							jQuery("#checkoutSteps .content").removeClass("open");
							jQuery("#checkoutSteps .checkout-block").removeClass("allow");
							
							/*jQuery("#opc-"+this.current_step + " .a-item").fadeOut(500,function(){
								jQuery("#opc-"+step ).addClass("open");
								jQuery("#opc-"+step + " .a-item").fadeIn();	
							});*/

							jQuery('.checkout-block').removeClass('active');
							jQuery('#checkout-step-login').css('display','none');
							jQuery('#checkout-step-billing').css('display','none');
							console.log(step);
							switch(step){
								case 'billing' 			:  { 
																jQuery("#opc-login").addClass("allow");
																jQuery("#opc-billing").addClass("allow");
																jQuery('#opc-billing').addClass('active'); 
																jQuery('#opc-billing .content').addClass('open');
															}break;
								case 'shipping' 		:  { 
																jQuery("#opc-login").addClass("allow");
																jQuery("#opc-billing").addClass("allow"); 
																jQuery('#opc-shipping-info').addClass('active'); 
																jQuery('#opc-shipping-info .content').addClass('open');
															}break;
								case 'shipping_method' 	:  { 
																jQuery("#opc-login").addClass("allow");
																jQuery("#opc-billing").addClass("allow");
																jQuery("#opc-shipping-info").addClass("allow");
																jQuery("#opc-shipping-method").addClass("allow");
																jQuery("#opc-shipping-method").addClass("active");
																jQuery('#opc-shipping-method .content').addClass('open');
															}break;
								case 'payment' 			:  { 
																jQuery("#opc-login").addClass("allow");
																jQuery("#opc-billing").addClass("allow"); 
																jQuery("#opc-shipping-info").addClass("allow");
																jQuery("#opc-shipping-method").addClass("allow");
																jQuery("#opc-payment-method").addClass("active");
																jQuery('#opc-payment-method .content').addClass('open');
															}break;
								case 'review' 			:  { 
																jQuery("#opc-login").addClass("allow");
																jQuery("#opc-billing").addClass("allow"); 
																jQuery("#opc-shipping-info").addClass("allow");
																jQuery("#opc-shipping-method").addClass("allow");
																jQuery("#opc-payment-method").addClass("allow");
																jQuery('#opc-review ').addClass('active');
																jQuery('#opc-review .content').addClass('open');
															}break;
							}
							this.current_step = step;
						},
						
			setMethod	: function(){
							if(jQuery("#login_guest:checked").val()){
								this.checkout_method = jQuery("#login_guest:checked").val();
								var me = this;
								jQuery.ajax({
									url 	:	this.config.method,
									method  : "POST",
									data 	:	{
													method : "guest"
												},
									success : function(){
													jQuery('#register-customer-password').css('display','none');
													me.gotoSection('billing');
													
												}
								});
								
								
							}
							else if(jQuery("#login_register:checked").val()){
								this.checkout_method = jQuery("#login_register:checked").val();
								var me = this;
								jQuery.ajax({
									url 	:	this.method_url,
									method  : "POST",
									data 	:	{
													method : "register"
												},
									success : function(responseText){
												console.log(responseText);
												jQuery('#register-customer-password').css('display','block');
												window.location.href = window.location.origin + "/Customer/AccountCreate";
												//me.gotoSection('billing');
											}
								});
							}
							else{
								alert('Please choose to register or to checkout as a guest');
            							return false;
							}
						},
			setBilling	: function(){
							console.log(jQuery("#billing_use_for_shipping_yes:checked").val());
							if(jQuery("#billing_use_for_shipping_yes:checked").val()){
								shipping.syncWithBilling();
								jQuery('#opc-shipping-info').addClass('allow');
    							
    							this.gotoSection('shipping_method');
    								
							}
							else if(jQuery("#billing_use_for_shipping_no:checked").val()){
								jQuery("#shipping-address-select option:last").attr('selected','selected');
								jQuery('#shipping_same_as_billing').prop('checked', false);
								jQuery('#opc-shipping').addClass('allow');
            					this.gotoSection('shipping');
							}
							
						},
			setCountryConfig	:	function(obj){
							var value = jQuery(obj).val();
							var country_config = this.country_config_url;
							jQuery.ajax({
								url 	:	country_config+value,
								success :	function(responseText){
									var data = JSON.parse(responseText);
									
									if(data.PostalCodeRequired){
										
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","none");
										
									}
									if(data.ShowAddressLine2){
										
										jQuery("#opc-"+checkout.current_step+" input[name=street2]").parent().css("display","none");
										
									}
									if(data.ShowHouseNumberExtension){
										
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","none");
										
									}
									if(data.ShowHouseNumberSeperate){
										console.log("#"+checkout.current_step+" .house_number");
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","none");
										
									}
									if(data.ShowMiddleName){
										console.log("#"+checkout.current_step+" .middle_name");
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","none");
										
									}
									if(data.ShowPostalCode){
										console.log("#"+checkout.current_step+" .postcode");
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","none");
										
									}
									if(data.ShowPostalCodeBeforePlace){
										console.log("#"+checkout.current_step+" .postcode");
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","none");
										
									}
									if(data.ShowRegion){
										console.log("#"+checkout.current_step+" .region");
										jQuery("#opc-"+checkout.current_step+" input[name=region_id]").parent().css("display","none");
										
									}
									if(data.ShowTitle){
										console.log("#"+checkout.current_step+" .customer_title");
										jQuery("#opc-"+checkout.current_step+" input[name=postcode]").parent().css("display","none");
										
									}
								}
								
							});
						},
			stepBack	: 		function(){
									var current_step_index = this.steps.indexOf(this.current_step);
									this.gotoSection(this.steps[--current_step_index]);
									console.log(this.current_step);
									console.log(current_step_index);
						},
		}
	)
})(jQuery);

//BILLING CLASS
(function($) {
	$.Class("Billing",
		{
		},
		{
			billing_form	:	"",
			address_url		: 	"",
			save_url 		:	"",
			init 			:	function(form, addressUrl, saveUrl){
									this.address_url = addressUrl;
									this.save_url = saveUrl;
									this.billing_form = jQuery("#"+form);
								},
			newAddress		:	function(){
							
								},
			save 	:	function(){
							//INCRAFORM.validateFormFields(); return;
							//if(!INCRAFORM.validateFormFields()) return;
									if(checkout.waiting) return;
									var thisurl = "";
									if(jQuery("#billing-address-select option:selected").val()){
										thisurl= this.address_url;
									}else{
										thisurl= this.save_url;
									}
									
									checkout.loading('billing');
									jQuery.ajax({
										url			:	thisurl,
										type 		:	"POST",
										data		: 	this.billing_form.serialize(),
										success 	:	function(responseText){
															console.log(thisurl);
															console.log('update progress');
															checkout.updateProgressBlock(responseText);
															checkout.doneLoading('billing');
															console.log('set billing');
															checkout.setBilling();
															
														}
									});
								},
			newAddress: function(isNew){
				
				if (isNew) {
				    this.resetSelectedAddress();
				    jQuery('#billing-new-address-form').css('display','block');
				} else {
				    jQuery('#billing-new-address-form').css('display','none');
				}
			},
			resetSelectedAddress: function(){
				var selectElement = jQuery('#billing-address-select');
					if (selectElement) {
				    	selectElement.val('');
					}
			},
		}
	)
})(jQuery);

//SHIPPING CLASS
(function($) {
	$.Class("Shipping",
		{
		},
		{
			shipping_form	:	"",
			address_url		: 	"",
			save_url 		:	"",
			init 			:	function(form, selectaAddressUrl,addressUrl, saveUrl){
									this.address_url = addressUrl;
									this.save_url = saveUrl;
									this.shipping_form = jQuery("#"+form);
									this.selectaAddressUrl=selectaAddressUrl;
									
								},
			newAddress		:	function(isNew){
							if (isNew) {
							    this.resetSelectedAddress();
							    jQuery('#shipping-new-address-form').css('display','block');
							} else {
							    jQuery('#shipping-new-address-form').css('display','none');
							}
						},
			resetSelectedAddress: function(){
				var selectElement = jQuery('#shipping-address-select');
					if (selectElement) {
					selectElement.val('');
					}
			},
			setSameAsBilling: function(flag) {
									jQuery('shipping_same_as_billing').checked = flag;
									if (flag) {
										this.syncWithBilling();
									}
								},
			
			syncWithBilling		:	function(){
			
									
									if(jQuery('#billing-address-select').val()=="" || jQuery('#billing-address-select').length==0) {

										jQuery("#shipping_firstname").val(jQuery("#billing_firstname").val());
										jQuery("#shipping_lastname").val(jQuery("#billing_lastname").val());
										jQuery("#shipping_company").val(jQuery("#billing_company").val());
										jQuery("#shipping_telephone").val(jQuery("#billing_telephone").val());
										jQuery("#shipping_address1").val(jQuery("#billing_address1").val());
										jQuery("#shipping_address2").val(jQuery("#billing_address2").val());
										jQuery("#shipping_postal_code").val(jQuery("#billing_postal_code").val());
										jQuery("#shipping_city").val(jQuery("#billing_city").val());
										
									}else {
										alert("no");
										jQuery('#shipping-address-select').val(jQuery('#billing-address-select').val());
										jQuery('#shipping-new-address-form').css('display','none');
										
									}
									this.save();
									
								},
			save				:	function(){
			
									if(checkout.waiting) return;
									
									var thisurl;
									if(jQuery("#shipping-address-select option:selected").val()){
										thisurl= this.selectaAddressUrl;
									}else{
										thisurl= this.address_url ;
									}

									checkout.loading('shipping');
									jQuery.ajax({
										url			:	thisurl,
										type 		:	"POST",
										data		: 	this.shipping_form.serialize(),
										success 	:	function(responseText){
														console.log(responseText);
														checkout.updateProgressBlock(responseText);
														checkout.doneLoading('shipping');
														checkout.gotoSection('shipping_method');
													}
									});
								},
			
		}
	)
})(jQuery);

//SHIPPINGMETHOD CLASS
(function($) {
	$.Class("ShippingMethod",
		{
		},
		{
			shipping_form	:	"",
			save_url 		:	"",
			init 			:	function(form, saveUrl){
									this.save_url = saveUrl;
									this.shipping_form = jQuery("#"+form);
									this.form_id=form;
								},
			newAddress		:	function(){
							
								},
			validate: function() {
				var methods = jQuery('#'+this.form_id+' :radio[name=method]');

				if (methods.length==0) {
					alert('Your order cannot be completed at this time as there is no shipping methods available for it. Please make necessary changes in your shipping address.');
					return false;
				}
				var checked=false;
				methods.each(function(){
					if(this.checked){
						checked=true;
					}
				});
				if (checked){
					return true;
				}else{
					alert('Please specify shipping method.');
					return false;
				}
			},
			save 	:	function(){
								if(checkout.waiting) return;
								
								if (this.validate()) {
									
									checkout.loading('shipping_method');

									jQuery.ajax({
										url		:	this.save_url,
										type 	:	"POST",
										data	: 	this.shipping_form.serialize(),
										success 	:	function(responseText){
														checkout.updateProgressBlock(responseText);
														checkout.doneLoading('shipping-method');
														checkout.gotoSection('payment');
													}
									});
								}
						},
			
		}
	)
})(jQuery);

//PAYMENTMETHOD CLASS
(function($) {
	$.Class("Payment",
		{
		},
		{
			payment_form	:	"",
			save_url 		:	"",
			init 			:	function(form, saveUrl){
									this.save_url = saveUrl;
									this.payment_form = jQuery("#"+form);
									this.form_id=form;

								},
			newAddress		:	function(){
							
								},
			validate: function() {
				var methods = jQuery('#'+this.form_id+' :radio[name=method]');

				if (methods.length==0) {
					alert('Your order cannot be completed at this time as there is no payment methods available for it.');
					return false;
				}
				/*var checked=false;
				methods.each(function(){
					if(this.checked){
						checked=true;
					}
				});*/
				if (jQuery('#co-payment-form :radio[name=method]:checked').length){
					return true;
				}else{
					alert('Please specify payment method.');
					return false;
				}
			},
			save 	:	function(){
									if(checkout.waiting) return;
									
									if (this.validate()) {
										checkout.loading('payment');
										jQuery.ajax({
											url		:	this.save_url,
											type 	:	"POST",
											data	: 	this.payment_form.serialize(),
											success 	:	function(responseText){
															checkout.updateProgressBlock(responseText);
															checkout.doneLoading('payment');
															checkout.gotoSection('review');
														}
										});
									}
								},
			
		}
	)
})(jQuery);

//REVIEW CLASS
(function($) {
	$.Class("Review",
		{
		},
		{
			agreements_form	:	"",
			save_url 		:	"",
			success_url		:	"",
			init 			:	function(saveUrl, successUrl,agreementsForm){
									this.save_url = saveUrl;
									this.success_url = successUrl;
									this.agreements_form = jQuery("#"+agreementsForm);
								},
			newAddress		:	function(){
							
								},
			save 	:	function(){
									var terms_to_check = jQuery(".agree-terms-and-conditions").length;
									var terms_checked = jQuery(".agree-terms-and-conditions:checked").length;

									if(terms_to_check == terms_checked){
										jQuery.ajax({
											url			:	this.save_url,
											type 		:	"POST",
											data		: 	{'confirmation':'yes'},
											success 	:	function(response){
															console.log(response);
														}
										});
										jQuery("#review_form").submit();
									}else{
										alert('Please check terms and condition.');
										return false;
									}
								},
			
		}
	)
})(jQuery);

