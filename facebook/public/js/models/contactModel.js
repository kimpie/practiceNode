var app = app || {};

(function () {
        'use strict';


	app.contactModel = Backbone.Model.extend({
		urlRoot: '/facebook/contact',
		defaults: {
			name: '',
			comment: '',
			player_id: ''
		}
	
	});

})();