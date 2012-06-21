define(
		[ 'jquery', 'backbone', 'model/PageModel',
		  'model/FlickrProxy', 'model/PresageProxy'],
		  function($, Backbone, PageModel, FlickrProxy, PresageProxy) {



			var dataCollection = Backbone.Collection
			.extend({

				model : PageModel,
				orientation : "landscape",
				
				defaults : [ {
					"cellId" : "r1c2",
					"status":  "awaitUrl"
				}, {
					"cellId" : "r2c1",
					"status":  "awaitUrl"
				}, {
					"cellId" : "r2c3",
					"status":  "awaitUrl"
				}, {
					"cellId" : "r3c2",
					"status":  "awaitUrl"
				} ],
				
				

				initialize : function() {

					models = this.models;

					Col = this;

					cellLoaded = 0;

					memory = "";

					// the num of img viewed
					depth = 0;

					// new grid coordonates of the last cell visited, once the page will be changed;
					lastCell = "";

					
					// proxies
					
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
					//this.beforeChange = _.bind(this.beforeChange, this);

					this.pageChangedHandler = _.bind(this.pageChangedHandler, this);

					$(document).bind("pagechange",
							this.pageChangedHandler);


					// end document
					// bind

				}, // end initialize
				
				//Callback from appView searchHandler
				search : function (searchValue) {
					
					//add a first model to receive the first image from the search box
					var m = new this.model;
					m.set('cellId','r2c2');
					m.set('status','awaitUrl');
					m.set('word',searchValue);
					this.add(m);
					
					//fetch Flickr for the searchValue image
					//success is handled by flickrSuccess
					// and navigation to the page is done in paveView onImgLoad()
					//(subsequent flickr calls are done in loadPresageImgs()
					var flickrProxy = new FlickrProxy;
					flickrProxy.word = searchValue;
					flickrProxy.fetch(flickrFetchOpt);
					
					//set presage context
					//presage will be fetched in pageChangedHandler
					//( when the image from search is displayed, pageChangedHandler is triggered)
					//success is handled by presageSuccess.
					//subsequent setting of context are done in directly in pageChangedHandler
					presageProxy.context = searchValue;
				},
				
				// success getting the Flickr API
				flickrSuccess : function(m, data) {
					console.log("FLICKR SUCCESS")
					//where m is FlickrProxy and data is the response
					
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
					
					if (photo){
					
					// resolution available: mstzb
					var resolution = "z";
					var imgUrl = "http://farm" + photo.farm
					+ ".staticflickr.com/" + photo.server + "/"
					+ photo.id + "_" + photo.secret + "_"
					+ resolution + ".jpg";
					
					this.assignUrl(m.word, imgUrl, photo.title);
					} else {
						
						console.log(">>>> no result found in flickr");
						
					}

				},
				
				assignUrl : function(word, imgUrl, caption) {
					console.log("word: "+ word +" assignUrl: "+imgUrl+ " CAPTION "+caption);

					// iterate through the model and give them an imgUrl
					// if they don't have one


					for ( var imgModel in this.models) {
						var m = this.models[imgModel];
						if (m.get("imgUrl") == "") {
								console.log("need url "+m.get("word"));
							if (m.get("status") == "awaitUrl" && m.get("word") == word) {
								console.log("?? awaitUlr");

								m.set("caption", caption, {
									silent : true
								});
								
								m.set("imgUrl", imgUrl, {
									silent : true
								});
								m.set("status", "hasUrl", {
									silent : true
								});
								
								//add an eventListener to update the links in view when the image will actually be loaded
								m.on ('imgLoadedEvent', this.modelImgLoaded, this);
								// event listened to in pageView. The url is assigned, now we render the page
								
									m.trigger("renderEvent");
								
								
								break;
							}
						}

					}


				},
				
				// success getting the Presage API
				// TODO test with the words "page", "likw" 
				presageSuccess : function(model, data) {
					console.log("PRESAGE SUCCESS");
				var result = $(data.firstChild.firstChild).siblings();
				var arr = [];
				for (var a=0 ; a< result.length ; a++){
					// TODO check if the order of the words is always the same
					console.log(a+" .... "+result[a].textContent);
					arr.push(result[a].textContent);
				}
				
				this.loadPresageImgs(arr);
				
				},
				
				
				presageError : function(model, data){
		
					console.log("[PageCollection] presage error: "+data.responseText);
					
				},
				
				// on presage success, Query Flickr with the words from Presage
				loadPresageImgs : function(w) {
					console.log("[PageCollection] loadPresageImgs");
				//
				// adding the models will instantiate all the view.
				// The views will only be rendered on "renderEvent"
				// binding to this event is done in pageView initialize	
				//this.add(this.defaults);
				
				console.log("[PageCollection] this.models.length "+this.models.length);
				
				for ( var a in this.models) {
					if (this.models[a].get("status") == "awaitUrl" && this.models[a].get("cellId") != "r2c2-r2c2") {
						console.log("[PageCollection] cellId"+this.models[a].get("cellId"));

						var _w = w.shift();
						
						this.models[a].set("word",_w);
						console.log(a+ " model>  "+this.models[a].get("word") );

						var flickrProxy = new FlickrProxy;
						flickrProxy.word = _w;
						flickrProxy.fetch(flickrFetchOpt);
						
					}
				}
			},

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
},


				forgetLastStep: function(){

					memory = memory.substr(0,memory.length - 5);	


				}

				,
				//let all the models know there is a new image loaded
				//so they can tell their view to display the corresponding link
				modelImgLoaded : function (m){

					var id = m.get("divId");
					for ( var a in this.models) {
						var mm = this.models[a];
					
						mm.trigger("newImgLoaded", id);
					
					}

				},
				
				//triggered after the page change
				pageChangedHandler : function(e, data) {
					


					// get the cellId of the new page (this is the short id, composed of 4 characters)
					var currentCell;
					// get the divId of the new page (complete concatenated id)
					var currentId = $(data.toPage).attr("id");
					
					if(currentId != "r2c2"){
						
						var cArray = currentId.split("-");
						// get the second to last (last being r2c2)
						cArray.pop();
						currentCell = cArray.pop();

					} else {

						currentCell = "r2c2";

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
						this.memorize(currentCell);
					} else if (newPageDepth == depth-2){
						//case moving backward
						isBackward = true;
						currentCell = this.oppositeCell(currentCell);
						this.forgetLastStep();
						depth --;
					}

					
					//TODO: if moving backwards, need to remove all 3 model, view and tag that are at level n+1 (waiting 
					//to be displayed but that are long longer needed

					//TODO: if moving backwards, need to truncate the memory


					//
					// remove unused pages (all pages exept the origine
					// the destination and the pages that are isHistory = true)
					//
					//
					
					
					if (depth != 0) {

						

						//remove all unused models and give the other the isHistory = true
						for ( var aa = models.length - 1; aa >= 0; aa--) {
							if ((models[aa].get("cellId") != currentCell)
									&& (models[aa].get("cellId") != "r2c2")
									&& (models[aa].get("isHistory") != true))
							{
								Col.remove(models[aa]);
							} else {
								
								models[aa].set({'isHistory': true});

							}
						}
							
						//loop through  the remaining models: fetch Presage with the new word and create new models
						for ( var b = 0; b < models.length ; b++) {	
							if(models[b]){
							if(models[b].get("divId") == currentId && models[b].get("word")){

							console.log("11 PRESAGE FETCH");
							console.log("xx cellId "+models[b].get("cellId"));
							console.log("xxx word "+models[b].get("word"));
							presageProxy.context = models[b].get("word");
							presageProxy.fetch(presageFetchOpt);
							}}
							//XXX check if keeping the history models is not going to screw cellLoaded
							cellLoaded = 2;
						}

						// the cell, once the transition is done, become the opposite, relatively to the center r2c2
						lastCell= this.oppositeCell(currentCell);

						// By merging the current models and the default,
						// it adds 3 new models for the possible upcoming pages. 
						// We do not remove the current page, or the last page seen (newId)

						//TODO when backward, remove a div that is left.
						//TODO when backward, improper link to next level down
						// get cue from history


						for ( var a in Col.defaults) {

							if (Col.defaults[a]["cellId"] != "r2c2"
								&& Col.defaults[a]["cellId"] != lastCell) {


								//in the case backward: ignore the currentCell
								if( !isBackward  || isBackward && Col.defaults[a]["cellId"] !=currentCell){

									//
									Col.add(Col.defaults[a]);
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

				}

			});// end dataCollection
			return dataCollection;

		});