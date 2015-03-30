function showQuickview(id){
	var top = window.scrollY;
	var height = jQuery("#quickview-"+id).height()/2;
	var quickview_top = top - height;
	jQuery("#quickview-"+id).css("top",quickview_top+"px");
	jQuery("#quickview-"+id).css("visibility","visible");
	jQuery("#quickview-"+id).fadeIn(500);
}
function closeQuickView(id){
	//jQuery("#quickview-"+id).css("visibility","hidden");
	jQuery("#quickview-"+id).fadeOut(500);
}
