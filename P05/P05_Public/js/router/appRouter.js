define( ['jquery',
         'jqueryMobile',
         'backbone'
         ],
        function( $, $$, Backbone) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";
            var AppRouter = Backbone.Router.extend( {
            	collection : {},
                routes: {
                    "nav/:mvt/:id":    				"function1",      
                    "photo/:id":                "function2",
                    "" : "root"                                      
                },
                function1: function(mvt,id) {
               
                var toDiv = "#" + id.toString();	
                //the changePage is intercepted by PageCollection
                //as I am customizing the page change, we cannot use data-direction
                //in the html. So I pass the transition type directly to PageCollection
                //to use it in call to changePage in beforeChange();
                //TODO add deep linking keeping image and text
                this.collection.setTransitionType(mvt);
                $.mobile.changePage(toDiv);

                },
                function2: function ( id ) {
                },
                root: function() {
                	console.log("root");
                    //centerView.render();
                },
            
                initialize:function(){
                	//subscribe Backbone to the browser’s hash changes
                 Backbone.history.start();
                 $.mobile.initializePage();
                }
            } );

            return AppRouter;
        } );
