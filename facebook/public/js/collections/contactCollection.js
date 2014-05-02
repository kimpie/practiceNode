var app = app || {};

(function () {

	app.Contact = Backbone.Collection.extend({
		model: app.contactModel,
		url: '/facebook/contact'
	});

})();