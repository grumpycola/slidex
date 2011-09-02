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
	
		
	$().piroBox({
		my_speed: 400, //animation speed
		bg_alpha: 0.3, //background opacity
		slideShow : true, // true == slideshow on, false == slideshow off
		slideSpeed : 4, //slideshow duration in seconds(3 to 6 Recommended)
		close_all : '.piro_close,.piro_overlay'// add class .piro_overlay(with comma)if you want overlay click close piroBox
	});		

	var Overlay = Backbone.View.extend({
		el: $("#overlay"),
		events: {
			"click": "hide"
		},
		hide: function() {
			this.el.fadeOut(100);
		}, 
		show: function() {
			this.el.fadeIn(100);
		}
	})

	var BaseDialog = Backbone.View.extend({
		overlay: null,
		events: { 
			"click .close": "close"
		},

		initialize: function() {
			this.el = $(this.el);
			this.el.hide();
			this.overlay = new Overlay();
		},

		show: function() {

			this.overlay.show();
			this.el.css({
				"left":"50%",
				"marginTop":-(this.el.outerHeight() / 2)
			}).fadeIn(300);
		},

		close: function() {
			this.el.fadeOut();
			this.overlay.hide();
		}
	});

	var AboutDlg = BaseDialog.extend({
		el: $("#about-dlg")

	});

	$("#about").click(function(){
		var dlg = new AboutDlg();
		dlg.show();
	});

	$("#main").fadeIn(500);
	

})(jQuery);
