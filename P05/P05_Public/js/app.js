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

			// http://developingwithstyle.blogspot.com.es/2010/11/jquery-mobile-swipe-up-down-left-right.html	
            
            
         // initializes touch and scroll events
            var supportTouch = $.support.touch,
                    scrollEvent = "touchmove scroll",
                    touchStartEvent = supportTouch ? "touchstart" : "mousedown",
                    touchStopEvent = supportTouch ? "touchend" : "mouseup",
                    touchMoveEvent = supportTouch ? "touchmove" : "mousemove";

     // handles swipeup and swipedown
            $.event.special.swipeupdown = {
                setup: function() {
                    var thisObject = this;
                    var $this = $(thisObject);

                    $this.bind(touchStartEvent, function(event) {
                        var data = event.originalEvent.touches ?
                                event.originalEvent.touches[ 0 ] :
                                event,
                                start = {
                                    time: (new Date).getTime(),
                                    coords: [ data.pageX, data.pageY ],
                                    origin: $(event.target)
                                },
                                stop;

                        function moveHandler(event) {
                            if (!start) {
                                return;
                            }

                            var data = event.originalEvent.touches ?
                                    event.originalEvent.touches[ 0 ] :
                                    event;
                            stop = {
                                time: (new Date).getTime(),
                                coords: [ data.pageX, data.pageY ]
                            };

                            // prevent scrolling
                            if (Math.abs(start.coords[1] - stop.coords[1]) > 10) {
                                event.preventDefault();
                            }
                        }

                        $this
                                .bind(touchMoveEvent, moveHandler)
                                .one(touchStopEvent, function(event) {
                            $this.unbind(touchMoveEvent, moveHandler);
                            if (start && stop) {
                                if (stop.time - start.time < 1000 &&
                                        Math.abs(start.coords[1] - stop.coords[1]) > 30 &&
                                        Math.abs(start.coords[0] - stop.coords[0]) < 75) {
                                    start.origin
                                            .trigger("swipeupdown")
                                            .trigger(start.coords[1] > stop.coords[1] ? "swipeup" : "swipedown");
                                }
                            }
                            start = stop = undefined;
                        });
                    });
                }
            };

    //Adds the events to the jQuery events special collection
            $.each({
                swipedown: "swipeupdown",
                swipeup: "swipeupdown"
            }, function(event, sourceEvent){
                $.event.special[event] = {
                    setup: function(){
                        $(this).bind(sourceEvent, $.noop);
                    }
                };
            });
/////////////////////////////////////////////////
        	
        	var _imgDataC = new imgDataCollection;
        	var _gridView = new gridView({collection: _imgDataC});

        	var _router = new AppRouter();
        	
        };

        return {
         init: init
        };
      });