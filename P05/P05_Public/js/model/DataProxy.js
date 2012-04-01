define([
  'underscore',
  'backbone'
], function(_, Backbone, constants) {
  var DataProxy = Backbone.Model.extend({
  	
	  isDebug : false,  
	  
  	words: ['apple','banana', 'horse', 'pinup', ' orange','head','dress', 'car','sport','plane','eat','work','shoes','leg','arm','apple','banana', 'horse', 'pinup', ' orange','head','dress', 'car','sport','plane','eat','work','shoes','leg','arm'],
	 url: function() {
		 if(this.isDebug){
		 return ".";
		 } else {
			 
		 var index = Math.floor(Math.random()*this.words.length);	 
		 return "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6a5342fd46df2623768be8ccfac1d723&text=" + this.words[index]+"&sort=interesting&is_commons=true&per_page=1&format=json&nojsoncallback=1";
		 }
		 },
	
    defaults: {
    }
  
  });
  
  return DataProxy;
  
  });
