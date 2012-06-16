define([
        'jquery',
        'jqueryMobile',
        'router/appRouter',
        'view/appView',
        'model/PageCollection' 
      ], function($, $$, AppRouter, appView, PageCollection){
        var init = function(){
        	
        	// let Backbone handle the routing
        	$.mobile.linkBindingEnabled = false;
            $.mobile.hashListeningEnabled = false;
            $.mobile.pushStateEnabled = false;
            
            //wait for the pages to be ready before initializing
            // initialization of JQM is in pageView.js image.onload()
            $.mobile.autoInitializePage = false;
            
            // initialization of Backbone is in appRouter.js initialize()

        	var _imgDataC = new PageCollection;
        	var _router = new AppRouter;
           	_router.collection = _imgDataC;
        	var _appView = new appView({collection: _imgDataC});
        	_appView.setRouter(_router);
        	
        	_imgDataC.orientation = $(window).width() > $(window).height() ? "landscape" : "portrait" ;
        	
            $(window).bind('orientationchange', function(event) {
            	
            	_imgDataC.orientation = event.orientation;
         	   alert(event.orientation + ' ' + _imgDataC.orientation); 
         	  
         	 });
 
        	
        };

        return {
         init: init
        };
      });