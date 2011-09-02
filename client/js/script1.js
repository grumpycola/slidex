(function($){

	$("#main").css('display', 'none');
	$('#loading').fadeOut(500);

	var $container = $('#portfolio');
	$container.imagesLoaded(function(){
		$container.masonry({
			itemSelector : '.box',
			columnWidth: 100,
			isAnimated: true
		});
	});	
	
		
	$("div.box").hover(
		function(){
			$(".description", this).slideToggle();
		}, 
		function() {
			$(".description", this).slideToggle();
		}
	);

		
	$().piroBox({
		my_speed: 400, //animation speed
		bg_alpha: 0.3, //background opacity
		slideShow : true, // true == slideshow on, false == slideshow off
		slideSpeed : 4, //slideshow duration in seconds(3 to 6 Recommended)
		close_all : '.piro_close,.piro_overlay'// add class .piro_overlay(with comma)if you want overlay click close piroBox
	});		


	$(".popup-btn").click(function(){
		$("#overlay").fadeIn();
	});

	$("#about").click(function(){
		$("#about-dlg").css({
			"left":"-50%",
			"marginTop":-($("#about-dlg").outerHeight() / 2),
			"display":"inherit"
		}).animate({left:"50%"},300);
	});

	$(".close, #overlay").click(function(){
		$(".popup-dlg").animate({left:"150%"},600).fadeOut();
		$("#overlay").fadeOut();
	});

		
	$("#main").fadeIn(500);
	
	$(document).keyup(function(e) {
	  if (e.keyCode == 27) { // esc
		$(".popup-dlg").animate({left:"150%"},600).fadeOut();
		$("#overlay").fadeOut();
	  }   
	});
		
})(jQuery);
