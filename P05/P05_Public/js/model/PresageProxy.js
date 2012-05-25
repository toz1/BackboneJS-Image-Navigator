define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var PresageProxy = Backbone.Model.extend({ 
	  
	  	url: function() {
	 
		 return "http://79.125.124.189/axis2/services/samples.Calculator/Word/context=hello";
		 },
		  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
		  methodMap : {
		    'create': 'POST',
		    'update': 'PUT',
		    'delete': 'DELETE',
		    'read':   'GET'
		  },
		  // Override this function to change the manner in which Backbone persists
		  // models to the server. You will be passed the type of request, and the
		  // model in question. By default, makes a RESTful Ajax request
		  // to the model's `url()`. Some possible customizations could be:
		  //
		  // * Use `setTimeout` to batch rapid-fire updates into a single request.
		  // * Send up the models as XML instead of JSON.
		  // * Persist models via WebSockets instead of Ajax.
		  //
		  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
		  // as `POST`, with a `_method` parameter containing the true HTTP method,
		  // as well as all requests with the body as `application/x-www-form-urlencoded`
		  // instead of `application/json` with the model in a param named `model`.
		  // Useful when interfacing with server-side languages like **PHP** that make
		  // it difficult to read the body of `PUT` requests.
		  sync : function(method, model, options) {
		    var type = this.methodMap[method];

		    // Default options, unless specified.
		    options || (options = {});

		    // Default JSON-request options.
		    var params = {type: type, dataType: 'xml'};

		    // Ensure that we have a URL.
		    if (!options.url) {
		      params.url = this.getValue(model, 'url') || this.urlError();
		    }

		    // Ensure that we have the appropriate request data.
		    if (!options.data && model && (method == 'create' || method == 'update')) {
		      params.contentType = 'application/json';
		      params.data = JSON.stringify(model.toJSON());
		    }

		    // For older servers, emulate JSON by encoding the request into an HTML-form.
		    if (Backbone.emulateJSON) {
		      params.contentType = 'application/x-www-form-urlencoded';
		      params.data = params.data ? {model: params.data} : {};
		    }

		    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
		    // And an `X-HTTP-Method-Override` header.
		    if (Backbone.emulateHTTP) {
		      if (type === 'PUT' || type === 'DELETE') {
		        if (Backbone.emulateJSON) params.data._method = type;
		        params.type = 'POST';
		        params.beforeSend = function(xhr) {
		          xhr.setRequestHeader('X-HTTP-Method-Override', type);
		        };
		      }
		    }

		    // Don't process data on a non-GET request.
		    if (params.type !== 'GET' && !Backbone.emulateJSON) {
		      params.processData = false;
		    }

		    // Make the request, allowing the user to override any Ajax options.
		    return $.ajax(_.extend(params, options));
		  },

		 
		 /*sync: function(){
			 console.log("sync");
			 var url = "http://54.247.185.202/axis2/services/samples.Calculator/Word/context=hello";
			  var xhr = new XMLHttpRequest();
			  if("withCredentials" in xhr)
			  {
				  $.support.cors = true;
				  console.log($.support.cors);
				  console.log("sync_1");
			   // Firefox 3.5 and Safari 4
				  xhr.open('GET', url, true);
				  xhr.setRequestHeader('Content-Type', 'text/plain');
			      xhr.onreadystatechange = this.handler;
			   xhr.send();
			  }
			  else if (XDomainRequest)
			  {
				  console.log("sync2");
			   // IE8
			   var xdr = new XDomainRequest();
			   xdr.open("get", url);
			   xdr.send();
			 
			   // handle XDR responses -- not shown here :-)
			  }
		 },*/
		 handler : function(e,d){
			 for (var a in e){
			 console.log ("PresageProxy handler: "+a+"  --> "+e[a]);
			 }
		 },
		  // Helper function to get a value from a Backbone object as a property
		  // or as a function.
		  getValue : function(object, prop) {
		    if (!(object && object[prop])) return null;
		    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
		  },

		  // Throw an error when a URL is needed, and none is supplied.
		  urlError : function() {
		    throw new Error('A "url" property or function must be specified');
		  },
	
    defaults: {
    }
  
  });
  
  return PresageProxy;
  
  });