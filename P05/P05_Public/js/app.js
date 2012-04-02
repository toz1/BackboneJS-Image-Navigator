define([
        'order!jquery',
        'order!jqueryMobile',
        'order!underscore',
        'order!backbone',
        'order!router/appRouter',
        'order!view/gridView',
        'order!model/ImgDataCollection' 
      ], function($, $$, _, Backbone, AppRouter, gridView,imgDataCollection){
        var init = function(){
        	// let Backbone handle the routing
        	$.mobile.linkBindingEnabled = false;
            $.mobile.hashListeningEnabled = false;
            $.mobile.pushStateEnabled = false;
            
            //wait for the pages to be ready before initializing
            $.mobile.autoInitializePage = false;


        	
        	var _imgDataC = new imgDataCollection;
        	var _gridView = new gridView({collection: _imgDataC});

        	var _router = new AppRouter();
        	_router.collection = _imgDataC;
        	
        };

        return {
         init: init
        };
      });