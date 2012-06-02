define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var FlickrProxy = Backbone.Model.extend({
	  
  	word: "",
	 url: function() {
		console.log("FlickrProxy "+this.word);
		 return "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6a5342fd46df2623768be8ccfac1d723&text=" + this.word +"&sort=interesting&is_commons=true&per_page=5&format=json&nojsoncallback=1&extras=o_dims";
		 
		 },
	
    defaults: {
    }
  
  });
  
  return FlickrProxy;
  
  });
