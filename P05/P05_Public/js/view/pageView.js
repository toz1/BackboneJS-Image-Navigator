define([ 'jquery', 'underscore', 'backbone',
		'text!../../html/pageView_tpl.html' ], function($, _, Backbone, tpl) {
	// Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
	"use strict";
	var pageView = Backbone.View.extend({
		router : {},
		  events: {
			    "swiperight"                : "swiperightHandler",
			    "swipeleft"         		: "swipeleftHandler",
			    "swipeup"   				: "swipeupHandler",
			    "swipedown"       			: "swipedownHandler",
			    "dblclick"					: 'dblclickHandler'
			  },
			  

			  
			  setRouter : function (r){
				  console.log("router is set: "+r);
				this.router = r;  
				  
			  },
			  
			  
			  dblclickHandler : function (e) {
				  //var txt = $('#navLeft',this.el).css("display");
				 //$(this.el).find('#txtView').html(txt);
				//this.router.navigate("nav/slideRight/"+this.model.get("leftNav"), {trigger: true});
				  
			  },
			swiperightHandler : function() { 
					$(this.el).find('#txtView').html("swipe right");
					// only naviguate if the link is displayed (the link is diplayed once the image is loaded)

					if($('#navLeft',this.el).css("display","block"))this.router.navigate("nav/slideR/"+this.model.get("leftNav"), {trigger: true});
					},
					
				swipeleftHandler : function() { 
					$(this.el).find('#txtView').html("swipe left");


					if($('#navRight',this.el).css("display","block"))this.router.navigate("nav/slideL/"+this.model.get("rightNav"), {trigger: true});
						},

					
				swipeupHandler : function(e){
					$(this.el).find('#txtView').html("swipe up");
					if($('#navBottom',this.el).css("display","block"))this.router.navigate("nav/slideU/"+this.model.get("bottomNav"), {trigger: true});
					},
					
				swipedownHandler : function(e){
					 $(this.el).find('#txtView').html("swipe down");


					if($('#navTop',this.el).css("display","block"))this.router.navigate("nav/slideD/"+this.model.get("topNav"), {trigger: true});
						},
			  

		onModelRemove : function() {
			//remove this view
			this.remove();
			//remove the HTML div
			$("#"+this.divId).remove();

		},

		render : function() {
			console.log("-- > RENDERING | word: "+this.model.get('word')+" | cellId: "+this.model.get('cellId'));

			// the actual id that is not going to be used outside this render function
			// cellId stays 4 alphanumeric reference to the position (top left is r1c1 etc)
			// getHistory is holding past positions. Every cell need to hold the whole history, in order to differenciate to consequtive move in the same direction

			var realCurrentId = this.collection.getHistory()
					+ this.model.get('cellId');

			//add "-r2c2" at the end of the id: every cell is meant to become center (r2c2),
			//so if it's set now there is no need to update this value once they are displayed
			//(the visible page always ends by r2c2, the naming of the target pages is an anticipation
			// so as not to have to chance the id once it's displayed)
			// set the divId on the model so as to be able in the Collection to avoid generating doubles
			
			//this.divId = realCurrentId == "r2c2-r2c2" ? "r2c2-r2c2" : realCurrentId + "-r2c2";
			
			this.divId = realCurrentId + "-r2c2";
			//check if divId already exists
			for ( var a in this.collection.models) {
				if (this.divId == this.collection.models[a].get("divId")){
					
					this.collection.remove(this.model);
					
				}
			}
			
			this.model.set("divId", this.divId);
			//
			
			
			//
			
			var vars = {};
			
			vars.cell = this.divId;
			vars.word = this.model.get("word");
			vars.caption = this.model.get("caption");
			vars.depth = this.collection.getDepth();

			

			//define the links to the next pages
			vars.topNav = realCurrentId + "-r1c2-r2c2";
			vars.rightNav = realCurrentId + "-r2c3-r2c2";
			vars.bottomNav = realCurrentId + "-r3c2-r2c2";
			vars.leftNav = realCurrentId + "-r2c1-r2c2";

			// change the link pointing to the page we are coming from 
			var prevLink = this.collection.getDepth() == 1 ? "r2c2-r2c2" : this.collection.getHistory()+"r2c2";
			
			switch(this.model.get('cellId')){
			case "r1c2":
				vars.bottomNav= prevLink;
				break;
			case "r2c3":
				vars.leftNav= prevLink;
				break;
			case "r3c2":
				vars.topNav= prevLink;
				break;
			case "r2c1":
				vars.rightNav= prevLink;
				break;
			
			};
			
			this.model.set("bottomNav", vars.bottomNav);
			this.model.set("leftNav", vars.leftNav);
			this.model.set("topNav", vars.topNav);
			this.model.set("rightNav", vars.rightNav);
			

			var tmpl = _.template(tpl, vars);

			if (this.collection.getDepth() == 0) {
				this.el =$("#" + vars.cell);
				this.el.replaceWith(tmpl);
				this.setElement($("#" + vars.cell));
			}
			else {

					this.el = $("#container");
					this.el.append(tmpl);
					this.setElement($("#"+vars.cell));
			}
			

			//check if the image of the target of the nav is already loaded
			
			//TODO condense this
			
			console.log("bottom nav  "+vars.bottomNav);
			
			for (var b in this.collection.models){
				var tmId = this.collection.models[b].get("divId");
				if (tmId == vars.bottomNav && this.collection.models[b].get("imgLoaded") == true){
					console.log("display bottom nav")
					this.displayLink(vars.bottomNav);
				}
				
				if (tmId == vars.topNav && this.collection.models[b].get("imgLoaded") == true){
					this.displayLink(vars.topNav);
				}
				
				if (tmId == vars.leftNav && this.collection.models[b].get("imgLoaded") == true){
					this.displayLink(vars.leftNav);

				}
				
				if (tmId == vars.rightNav && this.collection.models[b].get("imgLoaded") == true){
					this.displayLink(vars.rightNav);

				}
				
			}
			
			var image = new Image();
			image.onload = this.onImgLoad;
			
			image.src = this.model.get('imgUrl');


		},
		
		
		  onImgLoad :  function(e){

				var imgTag = $("#imContainer","#" + this.model.get("divId"));
				
				$(imgTag).find("img").replaceWith(e.target);
				if(this.model.get("divId") == "r2c2-r2c2"){

					this.router.navigate("nav/fade/r2c2-r2c2", {trigger: true});
					
				}
				
				this.model.set("imgLoaded", true, {
					silent : true
				});
				this.model.trigger("imgLoadedEvent", this.model);
	
			},
		newImgLoaded : function(id){
			
			if(this.model.get('divId') != "" && this.model.get('divId')!= id){
			this.displayLink(id);
			}
						
		},
		
		displayLink : function(link){
			//TODO unacessary calls are done
			console.log("+++> "+link);
			
			var m = this.model;
			var l;
			var w;
			
			
			//finds the (presage predicted) word for that link
			for (var b in this.collection.models){
				
				if (this.collection.models[b].get("divId") == link){
				w = this.collection.models[b].get("word");	
					
				}
				
			}
			
			switch(link){
			
			
			case m.get('bottomNav'):
				l = '#navBottom';
				break;
			
			case m.get('leftNav'):
				l = '#navLeft';
				break;
			case m.get('topNav'):
				l = '#navTop';
				break;
			case m.get('rightNav'):
				l = '#navRight';
				break;
				
			
			}
			
			//add the word to the navigation and displays it
			
			var btn = $("#"+m.get("divId")).find(l);
			
			if(l){
			btn.css("display","block");
			
			//if the page has been initialized by JQM, then '.ui-btn-text' exists and the text can be replaced
			if(btn.find('.ui-btn-text').html()) btn.find('.ui-btn-text').html(w);
			
			}
			
		},
		

		
		initialize : function() {
			

			console.log("INITIALAZING VIEW " +this.model.get("cellId")+"  >> "+this.model.get("divId"));
			this.onImgLoad = _.bind(this.onImgLoad, this);			  
			
			this.model.on("remove", this.onModelRemove, this);
			this.model.on("idChange", this.onIdChange, this);
			this.model.on("renderEvent", this.render, this);
			this.model.on("newImgLoaded", this.newImgLoaded, this);
			
			
			//divId is the id of the html Div that is bound to occurrence this view
			this.divId = "";
			
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
	   		}
	});

	return pageView;
});
