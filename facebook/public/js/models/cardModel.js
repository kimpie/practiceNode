var app = app || {};

(function () {
        'use strict';


	app.cardModel = Backbone.Model.extend({
		urlRoot: '/facebook/cards',
		defaults: {
			level: '',
			direction: '',
			rule: '',
			timer: ''
		}
	
	});

})();