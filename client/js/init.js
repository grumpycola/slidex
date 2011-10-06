/*!
 * init.js
 * http://mobile.rdacorp.com/
 *
 * Copyright (c) 2011 eka[dot]renardi[at]rdacorp[dot]com
 * Dual licensed under the MIT and GPL licenses.
 */

require([
	"js/libs/modernizr-1.7.min",
	"js/libs/jquery.easing.1.3",
	"js/libs/jquery.ui.totop",
	"js/libs/jquery.masonry.min",
	"js/libs/jquery.jscrollpane.min",
	"js/libs/mustache",
	"js/libs/jquery.mustache",
	"js/libs/pirobox.min",
	"js/libs/kizzy.min",
	"js/plugins",
	"js/app",
	"js/views",
	"js/models",
	"js/routers"
], function() {
  	require.ready(function() {	
		new App.Routers.Main();
		App.GalleryView = new App.Views.GalleryView();
		Backbone.history.start();            	
    });	
});


