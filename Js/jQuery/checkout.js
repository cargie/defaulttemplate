(function($) {
	$.Class("BaseCheckOut",
		{
		},
		{
			checkout_method		:	"",
			method_url	:	"",
			shippng_url	:	"",
			billing_url	:	"",
			payment_url	:	"",
			order_url	:	"",
			error_url	:	"",
			loading_block : "one-page-checkout-loading",
			waiting		:	false,
			steps		:	['login', 'billing', 'shipping', 'shipping_method', 'payment', 'review'],
			current_step		:	"login",
			
			
			callback	:	{
									load_waiting 	:	function (){},
									shipping_saved	:	function (){},
									billing_saved	:	function (){},
									payment_saved	:	function (){},
								},
			
			init	:	function(config){
							if(config){
								this.method_url  = config.method_url; 
								this.shippng_url = config.shippng_url;
								this.billing_url = config.billing_url;
								this.payment_url = config.payment_url;
								this.order_url 	 = config.order_url;
								this.error_url 	 = config.error_url;
								this.steps = "billing";
							}
						},
			ajaxFailure: function(){
        					location.href = this.failureUrl;
    					},
    		updateProgressBlock: function(responseText){
    								var data = JSON.parse(responseText);
    								test = data;
    								
    								test.forEach(function(data,index){
    									var location= data.Location;
    									var current_object = jQuery("body");
    									var current_el;
    									location.forEach(function(l){
										var pos = l;
										current_el=current_object.children().slice(pos - 1,pos);
										current_object = current_object.children("div").slice(pos - 1,pos);
											if(current_object.size()==0){
												current_object=jQuery(current_el).children('div');
											}
    									});
    									
    									jQuery(current_object).html(data.Content);	
    								});
    								return;
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
							var content = "#opc-"+step+" .content";
							jQuery(content).removeClass("open");
							jQuery(content).removeClass("allow");
							
							jQuery("#opc-"+this.current_step + " .a-item").fadeOut(500,function(){
								jQuery("#opc-"+step ).addClass("open");
								jQuery("#opc-"+step + " .a-item").fadeIn();	
							});
							jQuery('#checkout-step-login').css('display','none');
							jQuery('#checkout-step-billing').css('display','none');
							switch(step){
								case 'billing' 			:  { jQuery("#opc-login").addClass("allow");jQuery("#opc-billing").addClass("allow"); jQuery('#checkoutSteps opc-billing .content').css('display','block'); }break;
								case 'shipping' 		:  { jQuery("#opc-login").addClass("allow");jQuery("#opc-billing").addClass("allow"); }break;
								case 'shipping_method' 	:  { jQuery("#opc-login").addClass("allow");jQuery("#opc-billing").addClass("allow"); jQuery("#opc-shipping").addClass("allow"); }break;
								case 'payment' 			:  { jQuery("#opc-login").addClass("allow");jQuery("#opc-billing").addClass("allow"); jQuery("#opc-shipping").addClass("allow");jQuery("#opc-shipping_method").addClass("allow"); }break;
								case 'review' 			:  { jQuery("#opc-login").addClass("allow");jQuery("#opc-billing").addClass("allow"); jQuery("#opc-shipping").addClass("allow");jQuery("#opc-shipping_method").addClass("allow");jQuery("#opc-payment").addClass("allow");}break;
							}
							this.current_step = step;
						},
			setMethod	: function(){
							if(jQuery("#login_guest:checked").val()){
								this.checkout_method = jQuery("#login_guest:checked").val();
								var me = this;
								jQuery.ajax({
									url 	:	this.method_url,
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
												me.gotoSection('billing');
											}
								});
							}
							else{
								alert('Please choose to register or to checkout as a guest');
            							return false;
							}
						},
			setBilling	: function(){
							
							
							if(jQuery("#billing_use_for_shipping_yes:checked").val()){
								shipping.syncWithBilling();
								jQuery('#opc-shipping').addClass('allow');
    								this.gotoSection('shipping_method');
    								
							}
							
							else if(jQuery("#billing_use_for_shipping_no:checked").val()){
								jQuery('#shipping_same_as_billing').prop('checked', false);
								jQuery('#opc-shipping').addClass('allow');
								
            							this.gotoSection('shipping');
							}
							
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
									if(checkout.waiting) return;
									var thisurl = "";
									if(jQuery("#billing-address-select option:selected").val()){
										thisurl= this.address_url;
									}else{
										thisurl= this.save_url;
									}
									console.log(thisurl);
									console.log(this.billing_form.serialize());
									checkout.loading('billing');
									jQuery.ajax({
										url			:	thisurl,
										type 		:	"POST",
										data		: 	this.billing_form.serialize(),
										success 	:	function(responseText){
														console.log(responseText);
														checkout.updateProgressBlock(responseText);
														checkout.doneLoading('billing');
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
									
									console.log(thisurl);
									console.log(this.shipping_form.serialize());
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
									console.log(this.save_url);
									console.log(this.shipping_form.serialize());
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
				var checked=false;
				methods.each(function(){
					if(this.checked){
						checked=true;
					}
				});
				if (checked){
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
									if(!(jQuery("#agreementID") && jQuery("#agreementID:checked").val())){
										alert('Please check terms and condition.');
										return false;
									}
									
									/*jQuery.ajax({
										url		:	this.save_url,
										type 	:	"POST",
										success 	:	function(){
														'checkout.gotoSection('review');
													}
									});*/
									/*jQuery.post({
										url		:	this.save_url,
										type 	:	"POST",
									})*/
									jQuery("#review_form").submit();
								},
			
		}
	)
})(jQuery);


