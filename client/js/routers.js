/*!
 * Routers.js
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka[dot]renardi[at]rdacorp[dot]com
 * Dual licensed under the MIT and GPL licenses.
 */


App.Routers.Main = Backbone.Router.extend({
	routes: {
		""             : "index",
		"search/:term" : "search"
	},
	index: function() {
		App.GalleryView.fetch();
	},
	search: function( term ) {
		App.GalleryView.fetch( term, {emptyFirst:true} );
	}

});


