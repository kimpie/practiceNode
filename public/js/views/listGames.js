var app = app || {};

(function ($) {
        'use strict';

	app.listGames = Backbone.View.extend({

		tagName: 'li',

		template: Handlebars.compile(
			'<div>' + 
			'{{#each models}}<li>{{attributes.name}}</li>{{/each}}' +
			'</div>'
		),

		events: {
			'click .toggle': 'togglecompleted',
			'click .destroy': 'clear'
		},

		initialize: function  () {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.collection, "reset", this.render);
			this.listenTo(this.collection, "destroy", this.remove);
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));

			this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
			this.toggleVisible();                                             // NEW
			
			return this;
		},

	    toggleVisible : function () {
	      this.$el.toggleClass( 'hidden',  this.isHidden());
	    },

	    isHidden : function () {
	      var isCompleted = this.model.get('completed');
	      return ( // hidden cases only
	        (!isCompleted && app.TodoFilter === 'completed')
	        || (isCompleted && app.TodoFilter === 'active')
	      );
	    },

	    togglecompleted: function() {
	      this.model.toggle();
	    },

	});
})(jQuery);