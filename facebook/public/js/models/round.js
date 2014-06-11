var app = app || {};

(function () {

	// model to be nested:
	app.round = Backbone.Model.extend({
		getInfo: function () {
			return this.get("story") + this.get("card");
		}

	});

})();