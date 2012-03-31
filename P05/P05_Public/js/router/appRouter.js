define( ['order!jquery',
         'order!jqueryMobile',
         'order!underscore', 
         'order!backbone'
         ],
        function( $, $$, _, Backbone) {
            // Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
            "use strict";
            var AppRouter = Backbone.Router.extend( {
                routes: {
                    "/page/:id":    				"function1",      
                    "photo/:id":                "function2",
                    "" : "root"                                      
                },
                function1: function(id) {
                
                var toDiv = "#" + id.toString();	
                
                console.log("toDiv"+ toDiv);
                
                //the changePage is intercepted by ImgDataCollection
                $.mobile.changePage(toDiv);

                },
                function2: function ( id ) {
                    console.log('function2: '+id);
                },
                root: function() {
                	
                    console.log('router: root ');
                    //centerView.render();
                },
            
                initialize:function(){
                 Backbone.history.start();
                 

                }
            } );

            return AppRouter;
        } );
