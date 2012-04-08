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
			    "dblclick"						: 'clickHandler'
			  },
			  
			  setRouter : function (r){
				  
				this.router = r;  
				  
			  },
			  
			  
			  clickHandler : function (e) {
				  console.log(this.model.get('cellId')+"### click ### "+ this.model.get("leftNav"));
				  console.log("### LEFT NAV ### "+ this.model.get("leftNav"));
				  console.log("### RIGHT NAV ### "+ this.model.get("rightNav"));
				 $(this.el).find('#txtView').html( this.vars.rightNav);
				this.router.navigate("nav/slideRight/"+this.model.get("leftNav"), {trigger: true});
				  
			  },
			swiperightHandler : function() { 
					$(this.el).find('#txtView').html("swipe right");

					console.log("swipe right");
					this.router.navigate("nav/slideRight/"+this.model.get("rightNav"), {trigger: true});
					},
					
				swipeleftHandler : function() { 
					$(this.el).find('#txtView').html("swipe left");

					console.log("swipe left");

					this.router.navigate("nav/slideLeft/"+this.model.get("leftNav"), {trigger: true});
						},

					
				swipeupHandler : function(e){
					$(this.el).find('#txtView').html("swipe up");

					console.log("swipe up");

					this.router.navigate("nav/slideUp/"+this.model.get("topNav"), {trigger: true});
					},
					
				swipedownHandler : function(e){
					 $(this.el).find('#txtView').html("swipe down");

					console.log("swipe down");

					this.router.navigate("nav/slideDown/"+this.model.get("bottomNav"), {trigger: true});
						},
			  

		onModelRemove : function() {
			console.log("removing view");
			//remove this view
			this.remove();
			//remove the HTML div
			$("#"+this.divId).remove();

		},
		
		vars : {},

		render : function() {
			//var model = this.model;
			console.log("rendering model with memory: "
					+ this.collection.getHistory());

			// the actual id that is not going to be used outside this render function
			// cellId stays 4 alphanumeric reference to the position (top left is r1c1 etc)
			// getHistory is holding past positions. Every cell need to hold the whole history, in order to differenciate to consequtive move in the same direction

			var realCurrentId = this.collection.getHistory()
					+ this.model.get('cellId');

			console.log("REAL CURRENT ID: "+realCurrentId);
			//add "-r2c2" at the end of the id: every cell is meant to become center (r2c2),
			//so if it's set now there is no need to update this value once they are displayed
			//(the visible page always ends by r2c2, the naming of the target pages is an anticipation
			// so as not to have to chance the id once it's displayed)
			// set the divId on the model so as to be able in the Collection to avoid generating doubles
			
			this.divId = realCurrentId + "-r2c2";
			
			console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ........... ?????? "+this.divId);
			console.log("model cellId >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   "+this.model.get("cellId"));

			
			
			
			//check if divId already exists
			for ( var a in this.collection.models) {
				console.log("divId "+ this.collection.models[a].get("divId"));
				if (this.divId == this.collection.models[a].get("divId")){
					
					this.collection.remove(this.model);
					
				}
			}
			

			this.model.set("divId", this.divId);
			//
			
			
			//
			console.log("divId                   "+this.model.get("divId"));
			
			this.vars.cell = this.divId;
			this.vars.depth = this.collection.getDepth();

			console.log("vars.cell: ", this.vars.cell, "  depth: ", this.collection
					.getDepth());
			

			//define the links to the next pages
			this.vars.topNav = realCurrentId + "-r1c2-r2c2";
			this.vars.rightNav = realCurrentId + "-r2c3-r2c2";
			this.vars.bottomNav = realCurrentId + "-r3c2-r2c2";
			this.vars.leftNav = realCurrentId + "-r2c1-r2c2";
			console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"+this.model.get('cellId') +">>> this.vars.rightNav: "+this.vars.rightNav);

			// change the link pointing to the page we are coming from 
			//TODO keep memory of all pages visited
			console.log("[pageView] this.collection.getHistory() ::::::: >>>>> " +this.collection.getHistory());
			console.log("[pageView] this.collection.getHistory().lenght ::::::: >>>>> " +this.collection.getHistory().length);
			var prevLink = this.collection.getDepth() == 1 ? "r2c2-r2c2" : this.collection.getHistory()+"r2c2";
			
			switch(this.model.get('cellId')){
			case "r1c2":
				this.vars.bottomNav= prevLink;
				break;
			case "r2c3":
				this.vars.leftNav= prevLink;
				break;
			case "r3c2":
				this.vars.topNav= prevLink;
				break;
			case "r2c1":
				this.vars.rightNav= prevLink;
				break;
			
			};
			
			this.model.set("bottomNav", this.vars.bottomNav);
			this.model.set("leftNav", this.vars.leftNav);
			this.model.set("topNav", this.vars.topNav);
			this.model.set("rightNav", this.vars.rightNav);

			var template = _.template(tpl, this.vars);
		

			if (this.collection.getDepth() == 0) {
				this.el =$("#" + this.vars.cell);
				this.el.replaceWith(template);
				this.setElement($("#" + this.vars.cell));
			}
			else {
				var foundAvailDiv =false;
				var availableDiv1 = $("[data-role]='page'").filter(
						":not(.ui-page-active)").filter(":not[id]=''");

				for ( var a = 0; a < availableDiv1.length; a++) {
					console.log("  available div  ------>  " + availableDiv1[a].id);
					// replace the existing div until all are replaced, then add new ones
					//TODO see if I can always add DIV, and not replace
					//TODO once the binding of the removing of the model and the removing of the html DIV
					// is implemented: remove the replace mechanism
					//TODO review this
					if ($(availableDiv1[a]).attr("depth") == this.collection
							.getDepth() - 1
							&& this.collection.getDepth() < 5) {
						console.log("::1 "+$(availableDiv1[a]).attr("id"));
						this.el = $("#"+$(availableDiv1[a]).attr("id"));
						//this.el=$(availableDiv1[a]);
						this.el.replaceWith(template);
						this.setElement($("#"+$(availableDiv1[a]).attr("id")));
						foundAvailDiv = true;
						break;
					}
				}
					if(!foundAvailDiv){
					console.log("this.collection.getDepth() >= 5  cell:  ====>>> "+ this.vars.cell);
					this.el = $("#container");
					this.el.append(template);
					this.setElement($("#"+this.vars.cell));
					}
					
					

					

			}
			
			
			// add a load complete listener to the images
			//this.vars.url = this.model.get('imgUrl');
			var image = new Image();

//			var imgTag = $("img","#imContainer","#" + this.vars.cell);
			
			var imgTag = $("#imContainer","#" + this.vars.cell);
			
			console.log("???? : === >> "+imgTag.html());

			
			console.log("cell: ====================================================== >> "+this.vars.cell);

			console.log("SCR1: === >> "+$("img",imgTag).attr('src'));
			
			//
			//this.beforeChange = _.bind(this.beforeChange, this);
			var cell = this.vars.cell;
			var model = this.model;
			
			image.onload = function(){
				model.set("imgLoaded", true, {
					silent : false
				});
				//model.trigger("imgLoadedEvent", model);
				$(imgTag).find("img").replaceWith(image);
				console.log("IMAGE LOADED!!!!!!!!!!    >>>>  > > > this.vars.cell ... "+model.get("divId"));
				if(cell == "r2c2-r2c2"){$.mobile.initializePage();}
				
	
			};
			console.log(">>>> URL "+model.get('imgUrl'));
			image.src = model.get('imgUrl');

			
			//
			
			this.trigger("pageRendered", this.vars.cell);

		},
		newImgLoaded : function(id){
			
			console.log("=================IMAGE ID !!!!!!!!!!!!!!!!!!!!!!!!!  "+id);

			
			var mm = this.model;
			
			//XXX
			//TODO display the links once the images are loaded
			//else if(vars.cell == model.get("bottomNav")){
				
			//	$('#navBottom').css("display:block");
				
			//}
			
			//if (mm.get('bottomNav') == id || mm.get('leftNav') == id || mm.get('topNav') == id || mm.get('rightNav') == id){			
			switch(id){
			
			
			case mm.get('bottomNav'):
				console.log("=================???? !!!!!! BOTTMOM NOF  css: "+$('#navTop').css("display"));
				$('#navBottom').css("display","block");
				break;
			
			case mm.get('leftNav'):
				$('#navLeft').css("display","block");
				break;
			case mm.get('topNav'):
				$('#navTop').css("display","block");
				break;
			case mm.get('rightNav'):
				$('#navRight').css("display","block");
				break;
				
			
			}
			
		},
		initialize : function() {
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
