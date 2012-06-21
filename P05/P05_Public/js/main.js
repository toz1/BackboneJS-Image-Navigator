require.config({
	
  paths: {
  	jquery: 'lib/jquery-1.7.2.min',
  	jqueryMobile: 'lib/jquery.mobile-1.1.0.min',
  	lodash: 'lib/lodash-0.3.2.min',
  	backbone: 'lib/backbone-min-0.9.2',
    text: 'lib/text',
    domReady: 'lib/domReady-2.0.0'
  },
  
  shim: {

	  	underscore: {
	  		exports: '_'
	  	},
	  
        backbone: {
            deps: ['lodash', 'jquery'],
            exports: 'Backbone'
        }}
        


});

// use domReady to set autoInitializePage to false before JQM initialize

require(['domReady!','jquery','jqueryMobile'], function (doc) {
console.log("domReady");

// let Backbone handle the routing
$.mobile.linkBindingEnabled = false;
$.mobile.hashListeningEnabled = false;
$.mobile.pushStateEnabled = false;

//wait for the pages to be ready before initializing
// initialization of JQM is in pageView.js image.onload()
$.mobile.autoInitializePage = false; 

//TODO: check if in Chrome var popped is true when using the back btn

// http://stackoverflow.com/questions/6421769/popstate-on-pages-load-in-chrome/10651028#10651028
});

require(['app'],
        function(app) {
            app.init();
        } );