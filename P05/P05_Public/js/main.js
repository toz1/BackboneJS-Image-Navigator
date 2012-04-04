require.config({
	baseUrl: "js",
  paths: {
  	jquery: 'lib/jquery-1.7.1.min',
  	jqueryMobile: 'lib/jquery.mobile-1.1.0-rc.1.min',
    underscore: 'lib/underscoreAmd-min',
    backbone: 'lib/backboneAmd-min',
    order: 'lib/order',
    text: 'lib/text'
  }

});

require(['app'],
        function(App) {

             App.init();
        } );