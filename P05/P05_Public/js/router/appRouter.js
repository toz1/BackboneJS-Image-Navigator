define( ['jquery',
         'jqueryMobile',
         'backbone'
         ],
        function( $, $$, Backbone) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";
            var AppRouter = Backbone.Router.extend( {
            	mvt:"",
                routes: {
                    "nav/:mvt/:id":    				"hashChangeHandler",      
                    "" : "root"                                      
                },
                
                hashChangeHandler: function(m,id) {
                	
                var toDiv = "#" + id.toString();	
                //the changePage is intercepted by PageCollection
                //as I am customizing the page change, we cannot use data-direction
                //in the html.
                //TODO add deep linking keeping image and text
                this.mvt = m;
                console.log("toDiv: "+toDiv);
                $.mobile.changePage(toDiv);

                },

                root: function() {
                	console.log("[appRouter] root");
                	this.navigate("", {trigger: false});
                },
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
				 pagechangefailed: function(e){
                     console.log("page change failed: "+e);
				 },

            
                initialize:function(){
                	//subscribe Backbone to the browser’s hash changes
                	this.beforeChange = _.bind(this.beforeChange, this);
                	$(document).bind("pagebeforechange", this.beforeChange); 
                	$(document).bind("pagechangefailed", this.pagechangefailed);

                Backbone.history.start({pushState: true, root: "/index2"});
               
                $.mobile.initializePage();
                }
            } );

            return AppRouter;
        } );
