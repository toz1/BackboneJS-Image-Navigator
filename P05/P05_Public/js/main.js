require.config({
	
  paths: {
  	jquery: 'lib/jquery-1.7.1.min',
  	jqueryMobile: 'lib/jquery.mobile-1.1.0.min',
  	lodash: 'lib/lodash-0.3.2.min',
  	backbone: 'lib/backbone-min-0.9.2',
    text: 'lib/text'
  },
  
  shim: {
        backbone: {
            deps: ['lodash', 'jquery'],
            exports: 'Backbone'
        }}
        


});

require(["app"],
        function(app) {
            app.init();
        } );