var inGameDetails = Backbone.View.extend({
	template: Handlebars.compile(
		'<div>' +
		'<h1>{{msg}} {{name}}</h1>' +
		'<p>{{title}}</p>' +
		'</div>'
	),

	initialize: function  () {
		this.listenTo(this.model, "reset", this.render);
	},

	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}
});