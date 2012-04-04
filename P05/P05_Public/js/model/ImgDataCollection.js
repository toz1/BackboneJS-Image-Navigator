define(
		[ 'jquery', 'underscore', 'backbone', 'model/ImgDataModel',
				'model/DataProxy','view/pageView' ],
		function($, _, Backbone, ImgDataModel, DataProxy) {
			

			
			var dataCollection = Backbone.Collection
					.extend({
						// url:"http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6a5342fd46df2623768be8ccfac1d723",
						
						model : ImgDataModel,
						orientation : "landscape",
						defaults : [ {
							"cellId" : "r2c2",
							"status" : "awaitUrl"
						}, {
							"cellId" : "r1c2",
							"status" : "awaitUrl"
						}, {
							"cellId" : "r2c1",
							"status" : "awaitUrl"
						}, {
							"cellId" : "r2c3",
							"status" : "awaitUrl"
						}, {
							"cellId" : "r3c2",
							"status" : "awaitUrl"
						} ],

						getCellLoaded : function() {

							return cellLoaded;

						},
						incrementCellLoaded : function() {

							cellLoaded ++;
							if (cellLoaded==1)$.mobile.initializePage();

						},
						
						getHistory: function() {
							
						return memory;	
							
						},
						
						getDepth: function () {
							
						return depth;	
							
						},
						memorize: function(c){
						
						memory = memory  + c + "-";

						
						},
						
						forgetLastStep: function(){
							
						memory = memory.substr(0,memory.length - 5);	
							
							
						}
						
						,

						loadImg : function() {
							//
							// adding the models will instantiate all the view.
							// The views will only be rendered on model change
							// event.
							this.add(this.defaults);

							// fetch the images attributes from Flickr

							for ( var a in this.models) {
								if (this.models[a].get("status") == "awaitUrl") {
									if(!dataModel.isDebug){
										dataModel.fetch(fetchOptions);
										} else {
										this.localDebug();
										}
								}
							}
						},
						// success getting the Flickr API
						successfunction : function(model, data) {
							//select from the list the image with the correct orientation
							var index = -1;
							for (var a in data.photos.photo){
								var ratio = (data.photos.photo[a].o_width)/(data.photos.photo[a].o_height);
								if (this.orientation == "landscape" && ratio > 1){
									
								index = a;
								break;
									
								} else if (this.orientation == "portrait" && ratio < 1){
									
									index = a;
									break;	
									
									
								}
							}
							if(index == -1)index = 0;
							var photo = data.photos.photo[index];

							// resolution available: z, b
							var resolution = "b";
							var imgUrl = "http://farm" + photo.farm
									+ ".staticflickr.com/" + photo.server + "/"
									+ photo.id + "_" + photo.secret + "_"
									+ resolution + ".jpg";
							this.assignUrl(imgUrl);

						},// end success function
						localDebug : function(){
							
							this.assignUrl("img/im1.jpg");
							
							
						},

						assignUrl : function(imgUrl) {

							// iterate through the model and give them an imgUrl
							// if they don't have one
							
							for ( var i in this.models) {
								console.log("cellID ..........>> "+ this.models[i].get('cellId')+"   status: "+this.models[i].get("status"));	
								
							}

							for ( var imgModel in this.models) {
								var m = this.models[imgModel];
								if (!m.has("imgUrl")) {

									if (m.get("status") == "awaitUrl") {
										m.set("imgUrl", imgUrl, {
											silent : true
										});
										// event listened to in pageView. The url is assigned, now render the page
										console.log("..........>> "+ m.get('cellId'));
										
											m.trigger("renderEvent");
										m.set("status", "hasUrl", {
											silent : true
										});
										break;
									}
								}

							}

						},
						//direction of the slide movement (up,down,left,right), assigned by the router,
						//or the functions handling the swipe.
						setTransitionType : function(trstype){
							console.log("hello transition type: " + trstype);
							this.mvt = trstype;
							console.log("this.mvt: " + this.mvt);
						},
						mvt : "",
						
						//triggered before the page change
		                beforeChange : function(e, data) {
		                	
		
							if (typeof data.toPage === "string") {
									console.log("  ............TRANSITION TYPE3 .... "+data.toPage);
									$(data.toPage).page();
									console.log("  ............TRAN .... ");

									$.mobile.changePage($(data.toPage), {
										transition : "slide",
										allowSamePageTransition : true,
										changeHash : false
									});
									
									e.preventDefault();
								}//end if
		                	
		                },

						pageChangedHandler : function(e, data) {
							console.log("pageChangedHandler");
							// get the id of the new page
							var currentPage;
							
							if($(data.toPage).attr("id") != "r2c2"){
							var cArray = $(data.toPage).attr("id").split("-");
							// get the second to last (last being r2c2)
							cArray.pop();
							currentPage = cArray.pop();
							
							} else {
								
								currentPage = "r2c2";
								
							}
							
							// increment depth if we arrive on a new page, decrement if we are going back to the previous page
							var newPageDepth = $(data.toPage).attr('depth');
							//var to determin if we are moving to a new page (isBackward = false)
							//or going backward  (isBackward = true)
							var isBackward;
							if (newPageDepth == depth){
								//case moving forward
								isBackward = false;
								this.memorize(currentPage);
								depth ++;
								console.log("--> going forward");
							} else if (newPageDepth == depth-2){
								//case moving backward
								isBackward = true;
								currentPage = this.oppositeCell(currentPage);
								this.forgetLastStep();
								depth --;
								console.log("--> going backward");
							}
								
							
							//TODO: if moving backwards, need to remove all 3 model, view and tag that are at level n+1 (waiting 
							//to be displayed but that are long longer needed
							
							//TODO: if moving backwards, need to truncate the memory

							
							//
							// remove unused pages (all pages exept the origine
							// the destination and the pages that are isHistory = true)
							
							if (currentPage !="r2c2") {
								console.log("--> pageChangedHandler 2");
									

									for ( var aa = models.length - 1; aa >= 0; aa--) {
										//remove all unused models and give the other the isHistory = true
										if ((models[aa].get("cellId") !== currentPage)
												&& (models[aa].get("cellId") !== "r2c2")
												&& (models[aa].get("isHistory") !== true))
										{
											Col.remove(models[aa]);
											console.log("removing");
										} else {
											models[aa].set({'isHistory': true});
											
										}
										//XXX check if keeping the history models is not going to screw cellLoaded
										cellLoaded = 2;
									}

									// the cell, once the transition is done, become the opposite, relatively to the center r2c2
									lastCell= this.oppositeCell(currentPage);

									// By merging the current models and the default,
									// it adds 3 new models for the possible upcoming pages. 
									// We do not remove the current page, or the last page seen (newId)
									
									//TODO when backward, remove a div that is left.
									//TODO when backward, improper link to next level down
									// get cue from history
									
									for ( var aa in models) {
										console.log("################## ############ divId "+ models[aa].get("divId"));
									}
									
									for ( var a in Col.defaults) {

										if (Col.defaults[a]["cellId"] != "r2c2"
												&& Col.defaults[a]["cellId"] != lastCell) {
											
											
											//in the case backward: ignore the currentpage
											if( !isBackward  || isBackward && Col.defaults[a]["cellId"] !=currentPage){
											
											Col.add(Col.defaults[a]);
											
											if(!dataModel.isDebug){
												dataModel.fetch(fetchOptions);
												} else {
												this.localDebug();
												}
											}
										}

									}
							
							}// end if(!isFirstPage)

							else {
								console.log("CURRENT PAGE "+currentPage);
								isFirstPage = false;
							}
						},// end pageChangeHAndler
						oppositeCell : function(c){
							
							var newId;
							switch (c) {

							case "r1c2":
								newId = "r3c2";
								break;

							case "r2c3":
								newId = "r2c1";
								break;

							case "r3c2":
								newId = "r1c2";
								break;

							case "r2c1":
								newId = "r2c3";
								break;
							};	
							
						return newId;	
							
						},

						initialize : function() {
							isFirstPage = true;
							
							models = this.models;

							Col = this;

							cellLoaded = 0;
							
							memory = "";
							
							// the num of img viewed
							depth = 0;
							
							// new grid coordonates of the last cell visited, once the page will be changed;
							lastCell = "";

							// fetch options
							dataModel = new DataProxy;
							fetchOptions = {};

							successfunction = _
									.bind(this.successfunction, this);
							fetchOptions.success = successfunction;

							// 
							// binding to get a reference to this inside the functions
							this.beforeChange = _.bind(this.beforeChange, this);
							
							this.pageChangedHandler = _.bind(this.pageChangedHandler, this);

							$(document).bind("pagechange",
									this.pageChangedHandler);
							

		    				$(document).bind("pagebeforechange", this.beforeChange);
							
							// end document
																// bind

						} // end initialize

					});// end dataCollection
			return dataCollection;

		});