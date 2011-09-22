/*!
 * views.js
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka renardi
 * Dual licensed under the MIT and GPL licenses.
 */


//--------
App.Views.LoadingOverlay = Backbone.View.extend({
	el: $('#loading'),
	show: function() {
		this.el.fadeIn(100);
	},
	hide: function() {
		this.el.fadeOut(500);
	}
});

//--------
App.Views.BaseDialog = Backbone.View.extend({
	overlay: $("#overlay"),
	isShown: false,
	events: { 
		"click .close": "close"
	},

	initialize: function() {
		this.el = $(this.el);
		this.el.hide();

		var self = this;
		$('#overlay').click( function() {
			self.hide();
		})
	},

	show: function( callback ) {
		var dh = $(window).height();

		this.isShown = true;
		this.overlay.css('height', dh + 'px');
		this.overlay.fadeIn(100);
		this.el.fadeIn(300, callback );
	},

	close: function() {
		this.el.fadeOut();
		this.overlay.fadeOut(100);
		this.isShown = false;
	},

	hide: function() {
		this.el.fadeOut();
		this.overlay.fadeOut();
		this.isShown = false;
	},

	resize: function() {
		
		var wd = $(window).width(), 
		    el_wd = (wd/2),
		    el_left = ((wd - el_wd)/2) + 150;		
		this.el.css({
			'width'    : el_wd,
			'left'     : el_left,
			'marginTop':-(this.el.outerHeight() / 2)
		});	    
	}
});

//--------
App.Views.AboutDlg = App.Views.BaseDialog.extend({
	el: $("#about-dlg"),
	initialize: function( options ) {

		var self = this;
		$(window).resize( function() {
			self.render();
		});

		this.render();
		return this;
	},
	render: function() {
		this.resize();
		this.show( function() {
			var eh = $(window).height() - 200;
			$('.scroll-pane').css('height', eh);
	 		$('.scroll-pane').jScrollPane();
		});
	}
});


//--------
App.Views.PhotoView = Backbone.View.extend({
	template: $('#box-tmpl'),
	className: 'box',
	initialize: function() {
		// hide/display the zoom box
		var $el = $(this.el);
		$el.hover(function(){
			$(".zoom span", $el).fadeIn();
		}, function() {
			$(".zoom span", $el).fadeOut();
		});		
	},
	render: function() {
		$(this.el).html(this.template.mustache(this.model.attributes));
		return this;
	}
});


//--------
App.Views.GalleryView = Backbone.View.extend({
	el: $('#container'),
	loading: null, 
	isLoading: false,
	wall: $('#wall'),

	events: {
		"submit #search-form" : "submit",
		"click #about" : "about"	
	},

	initialize: function() {
		//this.el.css('display', 'none');
		this.loading = new App.Views.LoadingOverlay();
		this.isLoading = true;
		this.model = new App.Models.Gallery();

		var self = this;
		$(window).scroll( function() {
			if ($(window).scrollTop() == $(document).height() - $(window).height()) {
				if (self.isLoading) {
					return;
				}
				self.loadMore();	
			} 
		});

		return this;
	},

	render: function() {
		this.loading.hide();
		this.isLoading = false;
		//this.el.fadeIn(500);
	},

	renderGallery: function( options ) {
		
		var self = this;
		var $wall = this.wall;

		if ( options && options.emptyFirst ) {
			if ($wall.hasClass('masonry'))  $wall.masonry('destroy');
			$wall.empty();		
		}

		var els = [];
		var coll = self.model.get('photo');
		if (coll) {

			coll.forEach(function(item) {
				var photo = new App.Models.Photo(item);
				els.push( photo.view.render().el );
			})

			$wall.masonry({ itemSelector : '.box', columnWidth: 100 });

			var $boxes = $(els);
			$boxes.imagesLoaded( function() {
				$wall.append( $boxes ).masonry( 'appended', $boxes );

				$().piroBox({
					my_speed: 400, 
					bg_alpha: 0.9, 
					slideShow : true, 
					slideSpeed : 4,
					close_all : '.piro_close,.piro_overlay'
				});		

				self.render();	
			});

			$('#page-nav').attr({
				'uri': self.model.queryUri,
				'nextpage' : (self.model.get('page') + 1) 
			});

		} else {
			
			self.render();
		}

	},
		
	interesting: function( date ) {

		if (!date) {
			var d = new Date();
  			date = d.getFullYear() + '-' + pad2(d.getMonth()) + '-' + pad2(d.getDate());
		}

		var self = this;
		var uri = "interesting" + '/' + date;		
		this.model.fetchData( uri, function() {
			self.renderGallery({ emptyFirst: true });
		});
	},

	search: function( query ) {
		
		var self = this;
		var uri = "search" + '/' + encodeURIComponent(query);
		this.model.fetchData( uri, function() {
			self.renderGallery({ emptyFirst: true });
		});	

	},

	loadMore: function() {

		this.loading.show();
		this.isLoading = true;

		var self = this;
		var uri = $('#page-nav').attr('uri');
		this.model.set( {'page': $('#page-nav').attr('nextpage')} );
		this.model.fetchData( uri, function() {
			self.renderGallery();
		});
		
	},

	submit: function(e) {

		this.loading.show();
		this.isLoading = true;
		e.preventDefault();

		var qry = $('input[name=search-input]').val();
		if (qry) {
			this.search( qry );
		} else {
			this.interesting();
		}
	},


	about: function() {
		var dlg = new App.Views.AboutDlg();
		dlg.show();				
	}	

});
