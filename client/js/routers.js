/*!
 * Routers.js
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka renardi
 * Dual licensed under the MIT and GPL licenses.
 */


App.Routers.Main = Backbone.Router.extend({
	routes: {
		""                  : "index",
		"about"             : "about"
	},
	index: function() {
		App.GalleryView.interesting();
	},
	about: function() {
		var dlg = new App.Views.AboutDlg();
		dlg.show();	
	}
});


