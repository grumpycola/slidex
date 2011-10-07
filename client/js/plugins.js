/*!
 * plugins.js
 * http://mobile.rdacorp.com/
 *
 * original source from html5 boiler plate
 * Copyright (c) 2011 eka[dot]renardi[at]rdacorp[dot]com
 * Dual licensed under the MIT and GPL licenses.
 */

window.log = function() {
  log.history = log.history || [];  
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if (this.console) console.log( Array.prototype.slice.call(arguments) );
};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});

pad2 = function(number) {
	return (number < 10 ? '0' : '') + number;
};

isMobile =  function() {
	var r = navigator.userAgent.match(/Android/i) ||
			navigator.userAgent.match(/webOS/i) ||
			navigator.userAgent.match(/iPhone/i) ||
			navigator.userAgent.match(/iPod/i) || 
			navigator.userAgent.match(/iPad/i);
	return r;
};