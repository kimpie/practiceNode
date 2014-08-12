var app = app || {};

(function () {
        'use strict';


	app.wordModel = Backbone.Model.extend({
		defaults: {
			word: ''
		},

		idAttribute: '_id',

		initialize: function(options){
			var hash = location.hash.split('/');
			if (hash[4] == undefined){
				this.url = '/facebook/players/' + 'y' + '/games/' + 'x' + '/words';
			} else {
				this.url = '/facebook/players/' + hash[2] + '/games/' + hash[4] + '/words';
			}
		}

	});

})();