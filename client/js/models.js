/*!
 * models.js
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka[dot]renardi[at]rdacorp[dot]com
 * Dual licensed under the MIT and GPL licenses.
 */

App.Models.Photo = Backbone.Model.extend({
	view: null,
	initialize: function() {
		this.view = new App.Views.PhotoView({model: this});
		return this;
	}
});


App.Models.Gallery = Backbone.Model.extend({
	term: '',
	sort: null,
		
	initialize: function() {
		return this;
	},

	url: function() {
		var uri = 'http://slx.crux.io/',
	 	//var uri = 'http://localhost:3000/',
	 	    params = '',
	 	    page = this.get('page'),
	 	    term = this.term, 
	 	    sort = this.sort;

		// build the url	 		
		if (term) {
			uri = uri + 'search/' + encodeURIComponent(term);
		} else {
			var d = new Date();
  			date = d.getFullYear() + '-' + pad2(d.getMonth()) + '-' + pad2(d.getDate());
			uri = uri + 'interesting/' + date;
		}

		// additional params for page and/or sort
	 	if (page) {
	 		params = '?page=' + page;
	 	}
	 	if (sort) {

	 		var sortby = '';
	 		switch (sort) {
	 			case 1:  sortby = 'date-posted-asc'; break;
				case 2:  sortby = 'date-posted-desc'; break;
				case 3:  sortby = 'date-taken-asc'; break;
				case 4:  sortby = 'date-taken-desc'; break;
				case 5:  sortby = 'interestingness-asc'; break;
				case 6:  sortby = 'interestingness-desc'; break;
				case 7:  sortby = 'relevance'; break;
				default: sortby = 'date-taken-desc'; break;
	 		}
			params = params + ((params.length > 0) ? '&' : '?');
	 		params = params + 'sort=' + sortby;
	 	}

		return uri + params;
	},

	fetchData: function( term, sort, callback ) {

		this.term = term;
		this.sort = sort;

		this.fetch({
			success: function() { callback(); },
			error: function() { callback(); }
		});		
	}	
});


App.Models.OptionsData = Backbone.Model.extend({
	defaults: {
		background: 'url(../images/bg/water-lg.jpg)',
		sort: 4 //'date-posted-desc' 
	},

	cache: null,

	initialize: function() {
		this.cache = kizzy('slidex');

		this.set( {
			'background': this.cache.get('background') || this.defaults.background,
			'sort':  this.cache.get('sort') || this.defaults.sort
		});

		this.bind('change:background', this.saveBackground);
		this.bind('change:sort', this.saveSort);
		return this;
	},

	saveBackground: function( model, val ) {
		this.cache.set( 'background', val );
	},

	saveSort: function( model, val ) {
		this.cache.set( 'sort', val );
	}
	
});



