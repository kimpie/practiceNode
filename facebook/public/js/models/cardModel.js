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

		initialize: function(options){
			console.log(options);
		},

		url: function(){
			return '/facebook/players/' + 'x' + '/games/' + game.id + '/cards';
		}
	
	});

})();