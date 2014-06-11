var app = app || {};

(function () {
        'use strict';


	app.cardModel = Backbone.Model.extend({
		defaults: {
			level: '',
			direction: '',
			rule: ''
		},

		idAttribute: '_id',

		initialize: function(options){
			console.log(options);
			console.log(this.id);
			var hash = location.hash.split('/');
			console.log('cardModel hash' + hash);
			if (hash[4] == undefined){
				this.url = '/facebook/players/' + 'y' + '/games/' + 'x' + '/round/z'+'/cards';
			} else {
				this.url = '/facebook/players/' + hash[2] + '/games/' + hash[4] + '/round/' + hash[6] + '/cards';
			}
		}

	});

})();