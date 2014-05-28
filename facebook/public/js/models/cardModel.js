var app = app || {};

(function () {
        'use strict';


	app.cardModel = Backbone.Model.extend({
		defaults: {
			level: '',
			direction: '',
			rule: '',
			timer: ''
		},

		idAttribute: '_id',

		initialize: function(options){
			console.log(options);
			this.c = options._id;
		},

		url: function(){
			if (this.c != undefined){
				return '/facebook/players/' + 'x' + '/games/' + 'y'+ '/cards' + this.c;
			} else {
				return '/facebook/players/' + 'x' + '/games/' + 'y'+ '/cards';
			}
		}
	
	});

})();