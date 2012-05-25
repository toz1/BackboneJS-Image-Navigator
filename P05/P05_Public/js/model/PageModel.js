define([
  'underscore',
  'backbone'

], function(_, Backbone, pageView) {
  var pageModel = Backbone.Model.extend({
	  
	defaults: {
		 "status":  "awaitUrl",
		 "cellId": "",
		 "imgUrl": "",
		 "isHistory": false,
		 "divId": "",
		 "bottomNav": "",
		 "leftNav": "",
		 "topNav": "",
		 "rightNav": "",
		 "imgLoaded" : false
		  
	  }, 
	  
  	onChange: function(){
  		
  		
  	},
	initialize: function(){
		this.on('change',this.onChange);
		
		
	}
  
  });
  
  return pageModel;
  
  });
