/*!
 * models.js
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka renardi
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
	queryUri: null, 
	initialize: function() {
		return this;
	},

	url: function() {
		var url = 'http://slxrv.crux.io/' + this.queryUri;
	 	//var url = 'http://localhost:3000/' + this.queryUri;
	 	var page = this.get('page');
	 	if (page) {
	 		url = url + '?page=' + page;
	 	}
		return url;
	},

	fetchData: function( uri, callback ) {
		var self = this;
		this.queryUri = uri;
		this.fetch({
			success: function() { callback(); },
			error: function() { callback(); }
		});		
	}	
})
