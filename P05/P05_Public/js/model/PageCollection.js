define(
		[ 'jquery', 'underscore', 'backbone', 'model/PageModel',
		  'model/FlickrProxy', 'model/PresageProxy'],
		  function($, _, Backbone, PageModel, FlickrProxy, PresageProxy) {



			var dataCollection = Backbone.Collection
			.extend({
				// url:"http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6a5342fd46df2623768be8ccfac1d723",

				model : PageModel,
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

				},

				getHistory: function() {

					return memory;	

				},

				getDepth: function () {

					return depth;	

				},
				memorize: function(c){
					memory = memory  + c + "-";
					
				
							// case for the first page where r2c2 has already
							// been rendered in	assignUrl(), but the other models
							// still needs to be rendered	
					

						this.renderAll();
						
					


				},
				
				renderAll : function () {

						if (memory =="r2c2-" && assignedUrl == 5){
												for ( var imgMd in models) {
								var m2 = models[imgMd];
								// the divId will be attibuted in the view render()
								if(m2.get("divId") == "")m2.trigger("renderEvent");	
						}		}
					
				},

				forgetLastStep: function(){

					memory = memory.substr(0,memory.length - 5);	


				}

				,
				
				modelImgLoaded : function (m){

					var id = m.get("divId");
					for ( var a in this.models) {
						var mm = this.models[a];
					
						mm.trigger("newImgLoaded", id);
					
					}

				},

				loadInitImgs : function() {
					//******temp*********
					presageProxy.fetch(presageFetchOpt);
					//******/temp*********

					//
					// adding the models will instantiate all the view.
					// The views will only be rendered on model change
					// event.
					this.add(this.defaults);

					// fetch the images attributes from Flickr for the first time only
					// subsequent fetch are done in pageChangedHandler();
					for ( var a in this.models) {
						if (this.models[a].get("status") == "awaitUrl") {
							
							flickrProxy.fetch(flickrFetchOpt);
							
						}
					}
				},
				
				
				// success getting the Flickr API
				flickrSuccess : function(model, data) {
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

					// resolution available: mstzb
					var resolution = "z";
					var imgUrl = "http://farm" + photo.farm
					+ ".staticflickr.com/" + photo.server + "/"
					+ photo.id + "_" + photo.secret + "_"
					+ resolution + ".jpg";
					this.assignUrl(imgUrl);

				},// end success function
				
				
				// success getting the Presage API
				presageSuccess : function(model, data) {
					
				console.log(" [PageCollection] presage success: "+ data.firstChild.firstChild.firstChild.textContent);
				for (var a in data.firstChild.firstChild.firstChild){
					
					console.log(" [PageCollection] presage "+a+ " >>> "+ data.firstChild.firstChild.firstChild[a]);

					
				};
					
				},// end success function
				
				localDebug : function(){

					this.assignUrl("img/im1.jpg");


				},
				
				presageError : function(model, data){
		
					console.log("[PageCollection] presage error: "+data.responseText);
					
				},

				assignUrl : function(imgUrl) {

					// iterate through the model and give them an imgUrl
					// if they don't have one


					for ( var imgModel in this.models) {
						var m = this.models[imgModel];
						if (m.get("imgUrl") == "") {

							if (m.get("status") == "awaitUrl") {
								m.set("imgUrl", imgUrl, {
									silent : true
								});
								m.set("status", "hasUrl", {
									silent : true
								});
								
								//add an eventListener to update the links in view when the image will actually be loaded
								m.on ('imgLoadedEvent', this.modelImgLoaded, this);
								// event listened to in pageView. The url is assigned, now render the page
								
								assignedUrl ++;
								if(assignedUrl < 5 ){
									// case for the first page that will be rendered first
									if (m.get('cellId') == "r2c2")m.trigger("renderEvent");
								} else if (assignedUrl == 5){
									this.renderAll();
									
								}

								
								else{
									// in other cases, render all models
									m.trigger("renderEvent");
								}
								
								break;
							}
						}

					}


				},
				//direction of the slide movement (up,down,left,right), assigned by the router,
				//or the functions handling the swipe in pageView.js
				setTransitionType : function(trstype){
					this.mvt = trstype;
				},
				mvt : "",

				//triggered before the page change
				beforeChange : function(e, data) {
					// this is triggered twice by JQM (because I trigger the .changePage), once with a string,
					// and then a second time with page object created with
					// .page();
					// 


					if (typeof data.toPage === "string") {
						$(data.toPage).page();
						
						$.mobile.changePage($(data.toPage), {
							transition : this.mvt,
							allowSamePageTransition : true,
							changeHash : false
						});

						e.preventDefault();
					}//end if

				},
				
				//triggered after the page change
				pageChangedHandler : function(e, data) {
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
						depth ++;
						this.memorize(currentPage);
					} else if (newPageDepth == depth-2){
						//case moving backward
						isBackward = true;
						currentPage = this.oppositeCell(currentPage);
						this.forgetLastStep();
						depth --;
					}


					//TODO: if moving backwards, need to remove all 3 model, view and tag that are at level n+1 (waiting 
					//to be displayed but that are long longer needed

					//TODO: if moving backwards, need to truncate the memory


					//
					// remove unused pages (all pages exept the origine
					// the destination and the pages that are isHistory = true)

					if (currentPage !="r2c2") {


						for ( var aa = models.length - 1; aa >= 0; aa--) {
							//remove all unused models and give the other the isHistory = true
							if ((models[aa].get("cellId") !== currentPage)
									&& (models[aa].get("cellId") !== "r2c2")
									&& (models[aa].get("isHistory") !== true))
							{
								Col.remove(models[aa]);
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


						for ( var a in Col.defaults) {

							if (Col.defaults[a]["cellId"] != "r2c2"
								&& Col.defaults[a]["cellId"] != lastCell) {


								//in the case backward: ignore the currentpage
								if( !isBackward  || isBackward && Col.defaults[a]["cellId"] !=currentPage){

									Col.add(Col.defaults[a]);
									
									flickrProxy.fetch(flickrFetchOpt);
								}
							}

						}

					}// end 

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
					assignedUrl = 0;

					models = this.models;

					Col = this;

					cellLoaded = 0;

					memory = "";

					// the num of img viewed
					depth = 0;

					// new grid coordonates of the last cell visited, once the page will be changed;
					lastCell = "";

					
					// proxies
					flickrProxy = new FlickrProxy;
					presageProxy = new PresageProxy;
					
					// fetch options
					
					flickrFetchOpt = {};
					presageFetchOpt = {};

					//binding to keep the scope of this
					flickrSuccess = _.bind(this.flickrSuccess, this);
					presageSuccess = _.bind(this.presageSuccess, this);
					presageError = _.bind(this.presageError, this);

					//
					flickrFetchOpt.success = flickrSuccess;
					presageFetchOpt.success = presageSuccess;
					presageFetchOpt.error = presageError;

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