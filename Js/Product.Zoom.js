var Periodical = {};
var test = [];
jQuery.fn.extend({
	containerEl	:	"test",
	imageEl		:	"",
	handleEl		:	"",
	trackEl		:	"",
	hintEl		:	"",
	containerDim	:	{},
	imageDim		:	{},
	floorZoom		:	1,
	ceilingZoom		:	0,
	imageX			:	0,
	imageY			:	0,
	imageZoom		:	1,
	sliderSpeed		:	0,
	sliderAccel		:	0,
	zoomBtnPressed	:	false,
	showFull		:	false,
	zoomInEl		:	"",
	zoomOutEl		:	"",
	slider			:	"",
    ProductZoom	: function(imageEl, trackEl, handleEl, zoomInEl, zoomOutEl, hintEl){
    					var me = this;
    					console.log(this.containerEl);
    					
						this.containerEl = jQuery("#"+imageEl).parent().parent();
						this.imageEl = jQuery("#"+imageEl);
						this.handleEl = jQuery("."+handleEl);
						this.trackEl = jQuery("#"+trackEl);
						this.hintEl = jQuery("#"+hintEl);
						this.zoomInEl = jQuery("#"+zoomInEl);
						this.zoomOutEl = jQuery("#"+zoomOutEl);
						console.log(this.containerEl);
						console.log(this.imageEl);
						console.log(this.handleEl);
						console.log(this.trackEl);
						console.log(this.hintEl);
						console.log(this.zoomInEl);
						
						//this.containerDim = Element.getDimensions(this.containerEl);
						//this.imageDim = Element.getDimensions(this.imageEl);
						this.containerDim = { width : this.containerEl.width(),height : this.containerEl.height(), ratio : 0};
						this.imageDim = { width : this.imageEl.width(),height : this.imageEl.height(), ratio : 0 };
						console.log(this.containerDim);
						console.log(this.imageDim);

						this.imageDim.ratio = this.imageDim.width/this.imageDim.height;

						this.floorZoom = 1;
						console.log(this.imageDim);
						console.log(this.floorZoom);


						if (this.imageDim.width > this.imageDim.height) {
							this.ceilingZoom = this.imageDim.width / this.containerDim.width;
						} else {
							this.ceilingZoom = this.imageDim.height / this.containerDim.height;
						}
						console.log("ceiling zoom");
						console.log(this.ceilingZoom);
						
						if (this.imageDim.width <= this.containerDim.width
							&& this.imageDim.height <= this.containerDim.height) {
							this.trackEl.parent().hide();
							this.hintEl.hide();
							this.containerEl.removeClass('product-image-zoom');
							return;
						}

						this.imageX = 0;
						this.imageY = 0;
						this.imageZoom = 1;

						this.sliderSpeed = 0;
						this.sliderAccel = 0;
						this.zoomBtnPressed = false;

						this.showFull = false;

						this.selects = document.getElementsByTagName('select');
						
						
						/*this.draggable = new Draggable(imageEl, {
							starteffect:false,
							reverteffect:false,
							endeffect:false,
							snap:this.contain.bind(this)
						});*/
						
						
						/*this.slider = new Control.Slider(handleEl, trackEl, {
							axis:'horizontal',
							minimum:0,
							maximum:Element.getDimensions(this.trackEl).width,
							alignX:0,
							increment:1,
							sliderValue:0,
							onSlide:this.scale.bind(this),
							onChange:this.scale.bind(this)
						});*/

						this.scale(0);
						
						//Event.observe(this.imageEl, 'dblclick', this.toggleFull.bind(this));
						
						
						this.imageEl.dblclick(function() { me.toggleFull(me) });
						var track_width = this.trackEl.width();
						
						this.slider = jQuery("#slider" ).slider({
							min 	:	0,
							max 	:	track_width,
							step 	:	1,
							value 	: 	0,
							slide: function( event, ui ) {
								me.scale(ui.value/track_width);
								console.log(ui.value);
									
							}
						});
						
						Periodical = {
								timeout	:	"",
								zi	:	function(i){
											var value = me.slider.slider("option","value") + 1;
											var elWidth = me.trackEl.width();
											var _value = value/elWidth;
											var speed = 50;
						
											me.slider.slider("value",value);
											me.scale(value/elWidth);
											
											++i;
											
											if(i>3 && i <8)	speed = speed -30;
											
											if(i==10){
												return;
											}
											console.log(speed);
											setTimeout("Periodical.zi("+i+")",speed);
									},
								zo	:	function(i){
											var value = me.slider.slider("option","value") - 1;
											var elWidth = me.trackEl.width();
											var _value = value/elWidth;
											var speed = 50;
						
											me.slider.slider("value",value);
											me.scale(value/elWidth);
											
											++i;
											
											if(i>3 && i <8)	speed = speed -30;
											
											if(i==10){
												return;
											}
											console.log(speed);
											setTimeout("Periodical.zo("+i+")",speed);
									}
							}
						this.zoomInEl.bind('mousedown',jQuery.proxy(function(){
							var me = this;
							Periodical.zi(1);
						},this));
						
						this.zoomOutEl.bind('mousedown',jQuery.proxy(function(){
							var me = this;
							Periodical.zo(1);
						},this));
						
						/*return;
						Event.observe($(zoomInEl), 'mousedown', this.startZoomIn.bind(this));
						Event.observe($(zoomInEl), 'mouseup', this.stopZooming.bind(this));
						Event.observe($(zoomInEl), 'mouseout', this.stopZooming.bind(this));

						Event.observe($(zoomOutEl), 'mousedown', this.startZoomOut.bind(this));
						Event.observe($(zoomOutEl), 'mouseup', this.stopZooming.bind(this));
						Event.observe($(zoomOutEl), 'mouseout', this.stopZooming.bind(this));*/
						
						return me;
			},
			
			scale: function (v) {
				var centerX  = (this.containerDim.width*(1-this.imageZoom)/2-this.imageX)/this.imageZoom;
				var centerY  = (this.containerDim.height*(1-this.imageZoom)/2-this.imageY)/this.imageZoom;
				var overSize = (this.imageDim.width > this.containerDim.width || this.imageDim.height > this.containerDim.height);
				
				this.imageZoom = this.floorZoom+(v*(this.ceilingZoom-this.floorZoom));
				var diff = this.imageEl.width() - this.containerDim.width;
				
				
				
				if (overSize) {
					if (this.imageDim.width > this.containerDim.width) {
						//this.imageEl.style.width = (this.imageZoom*this.containerDim.width)+'px';
						this.imageEl.css("width",(this.imageZoom*this.containerDim.width)+'px');
						
						jQuery("#img-container").width((this.imageZoom*this.containerDim.width)+(diff)+'px');
						jQuery("#img-container").css({height:this.imageEl.height()+(diff*1.5)+'px'});
						
					} else if (this.imageDim.height > this.containerDim.height) {
						//this.imageEl.style.height = (this.imageZoom*this.containerDim.height)+'px';
						this.imageEl.css("height",(this.imageZoom*this.containerDim.height)+'px');
						jQuery("#img-container").width(jQuery("#img-container").width()+(diff*1.5)+'px');
						jQuery("#img-container").height((this.imageZoom*this.containerDim.height)+diff+'px');
					}
					
					if(this.containerDim.ratio){
						//this.imageEl.style.height = (this.imageZoom*this.containerDim.width*this.containerDim.ratio)+'px'; // for safari
						this.imageEl.css("height",(this.imageZoom*this.containerDim.width*this.containerDim.ratio)+'px');
					}
				} else {
					//this.slider.setDisabled();
					jQuery("#slider" ).slider({ disabled: true });
				}

				this.imageX = this.containerDim.width*(1-this.imageZoom)/2-centerX*this.imageZoom;
				this.imageY = this.containerDim.height*(1-this.imageZoom)/2-centerY*this.imageZoom;
				
				this.contain(this.imageX, this.imageY, this.imageEl);
				
				var l = this.containerDim.width/2 - jQuery("#img-container").width()/2;
				var t = this.containerDim.height/2 - jQuery("#img-container").height()/2;
				jQuery("#img-container").css({marginLeft:l+"px",marginTop:t+"px"});
				
				
				//console.log(this.imageEl.draggable( "option", "containment" ));
				var s_value = 0;
				try{
					s_value = jQuery("#slider" ).slider( "option", "value" );
				}catch(e){}
				if(s_value>1){
					this.imageEl.draggable({
						containment	: jQuery("#img-container"),
						scroll :	false,
					});
				}else if(s_value<=0){
					try{
						this.imageEl.draggable("destroy");
					}catch(e){}
				}
				return true;
			},
			toggleFull : function (me) {
				me.showFull = !me.showFull;
				
				//Hide selects for IE6 only
				if (typeof document.body.style.maxHeight == "undefined")  {
				    for (i=0; i<me.selects.length; i++) {
				        me.selects[i].style.visibility = me.showFull ? 'hidden' : 'visible';
				    }
				}
				//val_scale = !me.showFull ? me.slider.value : 1;
				val_scale = !me.showFull ? jQuery("#slider" ).slider("option","value")/me.trackEl.width() : 1;
				
				
				
				me.scale(val_scale);
				console.log('val_scale');
				console.log(val_scale);
				console.log('show full');
				console.log(me.showFull);
/*				me.trackEl.style.visibility = me.showFull ? 'hidden' : 'visible';
				me.containerEl.style.overflow = me.showFull ? 'visible' : 'hidden';
				me.containerEl.style.zIndex = me.showFull ? '1000' : '9';
*/
				me.trackEl.css('visibility',me.showFull ? 'hidden' : 'visible');
				me.containerEl.css('overflow',me.showFull ? 'visible' : 'hidden');
				me.containerEl.css('zIndex',me.showFull ? '1000' : '9');
				return me;
			},

			startZoomIn: function()
			{
				//if (!this.slider.disabled) {
				if (!this.slider.attr('disabled')) {
				    this.zoomBtnPressed = true;
				    this.sliderAccel = .002;
				    this.periodicalZoom();
				    this.zoomer = new PeriodicalExecuter(this.periodicalZoom.bind(this), .05);
				}
				return this;
			},

			startZoomOut: function()
			{
				if (!this.slider.disabled) {
				    this.zoomBtnPressed = true;
				    this.sliderAccel = -.002;
				    this.periodicalZoom();
				    this.zoomer = new PeriodicalExecuter(this.periodicalZoom.bind(this), .05);
				}
				return this;
			},

			stopZooming: function()
			{
				if (!this.zoomer || this.sliderSpeed==0) {
				    return;
				}
				this.zoomBtnPressed = false;
				this.sliderAccel = 0;
			},

			periodicalZoom: function()
			{
				if (!this.zoomer) {
				    return this;
				}

				if (this.zoomBtnPressed) {
				    this.sliderSpeed += this.sliderAccel;
				} else {
				    this.sliderSpeed /= 1.5;
				    if (Math.abs(this.sliderSpeed)<.001) {
				        this.sliderSpeed = 0;
				        this.zoomer.stop();
				        this.zoomer = null;
				    }
				}
				this.slider.value += this.sliderSpeed;

				this.slider.setValue(this.slider.value);
				this.scale(this.slider.value);

				return this;
			},

			contain: function (x,y,draggable) {
				//var dim = Element.getDimensions(draggable.element);
				var dim = { width	:	draggable.width(),height : draggable.height(), ratio : 0 };
				var xMin = 0, xMax = this.containerDim.width-dim.width;
				var yMin = 0, yMax = this.containerDim.height-dim.height;
				
				x = x>xMin ? xMin : x;
				x = x<xMax ? xMax : x;
				y = y>yMin ? yMin : y;
				y = y<yMax ? yMax : y;

				if (this.containerDim.width > dim.width) {
				    x = (this.containerDim.width/2) - (dim.width/2);
				}

				if (this.containerDim.height > dim.height) {
				    y = (this.containerDim.height/2) - (dim.height/2);
				}

				this.imageX = x;
				this.imageY = y;

				//this.imageEl.style.left = this.imageX+'px';
				//this.imageEl.style.top = this.imageY+'px';
				this.imageEl.css("left",this.imageX+'px');
				this.imageEl.css("top",this.imageY+'px');

				return [x,y];
			}
});
