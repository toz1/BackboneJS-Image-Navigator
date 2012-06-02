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
		
		vars : {},

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
			
			this.vars.cell = this.divId;
			this.vars.depth = this.collection.getDepth();

			

			//define the links to the next pages
			this.vars.topNav = realCurrentId + "-r1c2-r2c2";
			this.vars.rightNav = realCurrentId + "-r2c3-r2c2";
			this.vars.bottomNav = realCurrentId + "-r3c2-r2c2";
			this.vars.leftNav = realCurrentId + "-r2c1-r2c2";

			// change the link pointing to the page we are coming from 
			//TODO keep memory of all pages visited
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
				/*
				var foundAvailDiv =false;
				var availableDiv1 = $("div[data-role='page']").filter(":not('#homePage')").filter(":not(.ui-page-active)");
				console.log("::1 "+availableDiv1.length);
				var avai = $("div[data-role='header']");
				console.log("::2 "+availableDiv1);
				console.log("::3 "+avai);
				//console.log("availableDiv id ",availableDiv1.attr("id"));
				for ( var aa = 0; aa < availableDiv1.length; aa++) {
				console.log(aa + " :availableDiv1 ",availableDiv1[aa]);
				}
				for ( var a = 0; a < availableDiv1.length; a++) {
					// replace the existing div until all are replaced, then add new ones
					//TODO see if I can always add DIV, and not replace
					//TODO once the binding of the removing of the model and the removing of the html DIV
					// is implemented: remove the replace mechanism
					//TODO review this
					if ($(availableDiv1[a]).attr("depth") == this.collection
							.getDepth() - 1
							&& this.collection.getDepth() < 5) {
						this.el = $("#"+$(availableDiv1[a]).attr("id"));
						//this.el=$(availableDiv1[a]);
						this.el.replaceWith(template);
							console.log("1............................................. "+$(availableDiv1[a]).attr("id"));

						this.setElement($("#"+$(availableDiv1[a]).attr("id")));
						//for(var c in this.el){
						if(!this.el){
							console.log("FAIL "+$(availableDiv1[a]).attr("id"));
							this.el = $("#"+$(availableDiv1[a]).attr("id"));
							this.el.replaceWith(template);
							this.setElement($("#"+$(availableDiv1[a]).attr("id")));
						};
						//}
					
						
						foundAvailDiv = true;
						break;
					}
				}
					if(!foundAvailDiv){*/
						console.log("*************************************** ");

					this.el = $("#container");
					this.el.append(template);
					this.setElement($("#"+this.vars.cell));
					//} 
			}
			

			//check if the image of the target of the nav is already loaded
			
			var vars = this.vars;
			//TODO condense this
			for (var b in this.collection.models){
				var tmId = this.collection.models[b].get("divId");
				if (tmId == this.vars.bottomNav && this.collection.models[b].get("imgLoaded") == true){
					//this.collection.models[b].trigger("displayLinkEvent",this.collection.models[b].get("divId"));
					//this.collection.models[b].displayLink(tmId);
					this.displayLink(this.vars.bottomNav);
				}
				
				if (tmId == this.vars.topNav && this.collection.models[b].get("imgLoaded") == true){
					//this.collection.models[b].trigger("displayLinkEvent",this.collection.models[b].get("divId"));
					//this.collection.models[b].displayLink(tmId);
					this.displayLink(this.vars.topNav);
				}
				
				if (tmId == this.vars.leftNav && this.collection.models[b].get("imgLoaded") == true){
					//this.collection.models[b].trigger("displayLinkEvent",this.collection.models[b].get("divId"));
					//this.collection.models[b].displayLink(tmId);
					this.displayLink(this.vars.leftNav);
					//console.log("STYLE: "+document.getElementById('navLeft').style);
					//$('.navL').css('-webkit-transform', 'rotate(-45deg)');

				}
				
				if (tmId == this.vars.rightNav && this.collection.models[b].get("imgLoaded") == true){
					//this.collection.models[b].trigger("displayLinkEvent",this.collection.models[b].get("divId"));
					//this.collection.models[b].displayLink(tmId);
					this.displayLink(this.vars.rightNav);

				}
				
			}
			
			//var targetModel = _.filter(this.collection.models, function(m){ return (m.get("divId") == vars.rightNav
			//
			
			
			// add a load complete listener to the images
			//this.vars.url = this.model.get('imgUrl');


			//

			var image = new Image();
			console.log("SETTING SRC TO: "+this.el+" <> "+this.vars.cell);
			image.onload = this.onImgLoad;
			
			image.src = this.model.get('imgUrl');


		},
		
		
		  onImgLoad :  function(e){
			  	//make sure the replacing of the image does not interfer with the templating
				var imgTag = $("#imContainer","#" + this.vars.cell);
				console.log("replacing "+this.model.get("cellId"));
				console.log("replacing2 "+$(imgTag).find("img"));
				
				console.log("ha "+this.vars.cell);
				$(imgTag).find("img").replaceWith(e.target);
				console.log(":>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+this.vars.cell);
				if(this.vars.cell == "r2c2-r2c2"){

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
			
			
			var m = this.model;
			
			
			switch(link){
			
			
			case m.get('bottomNav'):
				$('#navBottom','#'+m.get("divId")).css("display","block");
				break;
			
			case m.get('leftNav'):
				$('#navLeft','#'+m.get("divId")).css("display","block");
				break;
			case m.get('topNav'):
				$('#navTop','#'+m.get("divId")).css("display","block");
				break;
			case m.get('rightNav'):
				$('#navRight','#'+m.get("divId")).css("display","block");
				break;
				
			
			}
			
		},
		

		
		initialize : function() {
			

			
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
