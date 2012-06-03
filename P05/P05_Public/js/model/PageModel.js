define([
  'underscore',
  'backbone'

], function(_, Backbone, pageView) {
  var pageModel = Backbone.Model.extend({
	  
	defaults: {
		 "word":  "",
		 "title" : "",
		 "status":  "",
		 //cellId is referencing the position inside a grid system from row 1 collumn 1 (r1c1) to row 3 collumn 3 (r3c3)
		 "cellId": "",
		 "imgUrl": "",
		 "isHistory": false,
		 //divId is the actual id of the div in the html, built from a combination of cellId (concatenation of all visited cell +r2c2)
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
