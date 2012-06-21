define([
        'jquery',
        'jqueryMobile',
        'router/appRouter',
        'view/appView',
        'model/PageCollection' 
      ], function($, $$, AppRouter, appView, PageCollection){
        var init = function(){
        	

            

            
            // initialization of Backbone is in appRouter.js initialize()

        	var _imgDataC = new PageCollection;
        	var _router = new AppRouter;
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