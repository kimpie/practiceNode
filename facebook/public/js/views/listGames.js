var listGames = Backbone.View.extend({

	template: Handlebars.compile(
		'<ul>' + 
		'{{#each models}}<li>{{attributes.name}}</li>{{/each}}' +
		'</ul>'
	),

	initialize: function  () {
		this.listenTo(this.collection, "reset", this.render);
	},

	render: function () {
	this.$el.html(this.template(this.collection));
		return this;
	}

});