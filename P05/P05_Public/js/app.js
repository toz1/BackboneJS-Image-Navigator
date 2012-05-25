define([
        'order!jquery',
        'order!jqueryMobile',
        'order!underscore',
        'order!backbone',
        'order!router/appRouter',
        'order!view/gridView',
        'order!model/PageCollection' 
      ], function($, $$, _, Backbone, AppRouter, gridView, PageCollection){
        var init = function(){
        	
        	// let Backbone handle the routing
        	$.mobile.linkBindingEnabled = false;
            $.mobile.hashListeningEnabled = false;
            $.mobile.pushStateEnabled = false;
            
            //wait for the pages to be ready before initializing
            // initialization is done in pageView image.onload()
            $.mobile.autoInitializePage = false;

        	var _imgDataC = new PageCollection;
        	var _router = new AppRouter;
           	_router.collection = _imgDataC;
        	var _gridView = new gridView({collection: _imgDataC});
        	_gridView.setRouter(_router);
        	
        	_imgDataC.orientation = $(window).width() > $(window).height() ? "landscape" : "portrait" ;
        	
            $(window).bind('orientationchange', function(event) {
            	
            	_imgDataC.orientation = event.orientation;
         	   alert(event.orientation + ' ' + orientation); 
         	  
         	 });
 
        	
        };

        return {
         init: init
        };
      });