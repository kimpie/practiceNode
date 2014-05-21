var app = app || {};

(function () {

	app.Card = Backbone.Collection.extend({
		model: app.cardModel,
		url: '/facebook/cards'
	});

})();