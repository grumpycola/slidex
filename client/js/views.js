/*!
 * views.js
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka[dot]renardi[at]rdacorp[dot]com
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
	},

	close: function() {
		this.el.fadeOut();
		this.overlay.fadeOut(100);
		this.el.hide();
		this.overlay.hide();
		this.isShown = false;
	},

	render: function( callback ) {
		var wd = $(window).width(), 
		    dh = $(window).height(),
		    el_wd = (wd/2),
		    el_left = ((wd - el_wd)/2) + 150;		

		this.overlay.css('height', dh + 'px');
		this.el.css({
			'width'    : el_wd,
			'left'     : el_left,
			'marginTop':-(this.el.outerHeight() / 2)
		});	    

		this.overlay.show();
		this.el.fadeIn( callback );
		this.isShown = true;
	}
});

//--------
App.Views.AboutDlg = App.Views.BaseDialog.extend({
	el: $("#about-dlg"),
	initialize: function( options ) {

		var self = this;
		$(window).resize( function() {
			if (!self.isShown) return;
			self.show();
		});

		var eh = $(window).height() - 200;
		$('.scroll-pane').css('height', eh);					

		return this;
	},

	drawScrollPane: function() {
		var eh = $(window).height() - 200;
		$('.scroll-pane').css('height', eh);					
 		$('.scroll-pane').jScrollPane();
	},

	show: function() {
		this.render( this.drawScrollPane );
	}
});

//--------
App.Views.OptionsView = Backbone.View.extend({
	el: $('#nav-sub'),
	events: { 
		"dblclick .submenu-content" : "render" ,
		"click .bgimage"            : "setBackground",
		"change #sort-by"           : "setSortBy"
	}, 
	initialize: function( options ) {
		this.model = options.model;
		this.el.css( {height:'0'} );
		$('.submenu').hide();
		return this;
	},

	render: function( e ) {

		var status = this.el.height();
		if(status === 0) {
			this.show( e );
		} else {
			this.hide( e );
		}
		return this;
	},

	show: function( e ) {
		$(this.el).animate({height:'240px'}).animate({height:'220px'},'300');
		if (e) {
			var el = $(e);
			el.addClass('active');
			var submenu = '#' + el.attr('id') + '-submenu';
			$(submenu).siblings('submenu').hide();
			$(submenu).show();
		} else {
			$('.submenu').hide();
			$('.nav-main-subnav').removeClass('active');
		}
		$('#sort-by').prop( 'selectedIndex', this.model.get('sort') );
	},

	hide: function( e ) {
		$(this.el).animate({height:'240px'}).animate({height:'0'},'250', function(){
			$('.submenu').hide();
			$('.nav-main-subnav').removeClass('active');
		});
	},

	setBackground: function( e ) {
		
		var img = $(e.target).css('backgroundImage');
		img = img.substring(0, img.length -5) + '-lg.jpg)';
		this.model.set( {'background': img} );
	},

	setSortBy: function() {
		
		var val = $('#sort-by').prop('selectedIndex');
		// if first selection, ignore it
		if (val == 0) return;
		// set the model's sort property 
		this.model.set( {'sort': val} );
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
		// render this model using mustache template
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
	optionsData: null, 
	optionsView: null,

	events: {
		"submit #search-form" : "submit",
		"click #options"      : "doOptions", 
		"click #about"        : "doAbout"
	},

	initialize: function() {

		var self = this;
		
		// draw the toTop element
		$().UItoTop();

		// show the loading....
		this.loading = new App.Views.LoadingOverlay();
		this.isLoading = true;

		// 
		this.model = new App.Models.Gallery();

		this.optionsData = new App.Models.OptionsData();
		// when background attribute is changed, then re-render the background image
		this.optionsData.bind( 'change:background', this.renderBackground );
		this.renderBackground( this.optionsData );

		// when sort by attribute is changed, then fetch and redraw gallery
		this.optionsData.bind( 'change:sort', function() {
			self.fetch( '', {emptyFirst: true} );
		});

		// create the options view
		this.optionsView = new App.Views.OptionsView( { model: this.optionsData } );

		// handle the window.scroll event, perform infinite scrolling
		$(window).scroll( function() {
			if ($(window).scrollTop() == $(document).height() - $(window).height()) {
				// still loading, then ignore the rest
				if (self.isLoading) {
					return;
				}
				// set the next page
				self.model.set( {'page': $('#page-nav').attr('nextpage')} );
				// fetch some more
				self.fetch();
			} 
		});

		return this;
	},

	render: function() {
		// hide the loading...
		this.loading.hide();
		this.isLoading = false;
	},

	renderWall: function( options ) {
		
		var self = this;
		var $wall = this.wall;

		// empty the wall first?
		if ( options && options.emptyFirst ) {
			if ($wall.hasClass('masonry')) {
				$wall.masonry('destroy');	
			} 
			$wall.empty();		
		}

		// get the list of photos, load them up, arrange it into masonry
		var els = [];
		var coll = self.model.get('photo');
		if (coll) {

			coll.forEach( function(item) {
				var photo = new App.Models.Photo(item);
				els.push( photo.view.render().el );
			})

			// instantiate masonry
			$wall.masonry( {itemSelector : '.box', columnWidth: 100} );

			// once all the images are loaded, append it to wall, and instantiate pirobox
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

				// hide the loading screen and done
				self.render();	
			});

			// set the term, nextpage attr, giving cluues for infinite scrolling
			$('#page-nav').attr({
				'term': self.model.term,
				'nextpage' : (self.model.get('page') + 1) 
			});

		} else {
			
			// hide the loading screen, and done
			self.render();
		}

	},

	renderBackground: function( model ) {

		var img = model.get('background');
		if (img) {
			$('body').css('background', img + ' no-repeat center center fixed');	
		}
		
	},


	fetch: function( term, options ) {
		
		this.loading.show();
		this.isLoading = true;

		var self = this,
		    qry = term || $('#page-nav').attr('term'),
		    sort = this.optionsData.get('sort');

		// fetch from server		    
		this.model.fetchData( qry, sort, function() {
			self.renderWall( options );
		});	

	},

	submit: function(e) {
		e.preventDefault();

		var term = $('input[name=search-input]').val();
		this.fetch( term, {emptyFirst: true} );
	},

	doOptions: function( e ) {
		this.optionsView.render( e.target );
	},

	doAbout: function() {
		var dlg = new App.Views.AboutDlg();
		dlg.show();	
	}

});
