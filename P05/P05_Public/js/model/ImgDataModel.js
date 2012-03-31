define([
  'underscore',
  'backbone'

], function(_, Backbone, pageView) {
  var imgModel = Backbone.Model.extend({
  	
  	onChange: function(){
  		
  		console.log("changing model: "+this.get('cellId'));
  		
  	},
	initialize: function(){
		this.on('change',this.onChange);
		
		
	}
  
  });
  
  return imgModel;
  
  });
