define( ['order!jquery',
         'order!jqueryMobile',
         'order!underscore', 
         'order!backbone'
         ],
        function( $, $$, _, Backbone) {
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
                //the changePage is intercepted by ImgDataCollection
                //as I am customizing the page change, we cannot use data-direction
                //in the html. So I pass the transition type directly to ImgDataCollection
                //to use it in call to changePage in beforeChange();
                //TODO add deep linking keeping image and text
                this.collection.setTransitionType(mvt);
                
                $.mobile.changePage(toDiv);

                },
                function2: function ( id ) {
                },
                root: function() {
                	
                    //centerView.render();
                },
            
                initialize:function(){
                 Backbone.history.start();
                }
            } );

            return AppRouter;
        } );
