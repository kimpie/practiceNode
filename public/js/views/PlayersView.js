var app = app || {};

(function ($) {
        'use strict';

	app.PlayersView = Backbone.View.extend({

		template: Handlebars.compile(
			'<h3>Welcome {{name}}</h3>'

		),

		events: {
		//	'click .toggle': 'togglecompleted',
		//	'click .destroy': 'clear'
		},

		initialize: function  () {
			this.listenTo(this.model, "change", this.render);
		//	socket = io.connect('https://completethesentence.com/');
		},

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));

			//this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
			//this.toggleVisible();                                             // NEW
			
			return this;
		},

	    toggleVisible : function () {
	      this.$el.toggleClass( 'hidden',  this.isHidden());
	    }

	   /* isHidden : function () {
	      var isCompleted = this.model.get('completed');
	      return ( // hidden cases only
	        (!isCompleted && app.TodoFilter === 'completed')
	        || (isCompleted && app.TodoFilter === 'active')
	      );
	    },

	    togglecompleted: function() {
	      this.model.toggle();
	    },*/

	});
})(jQuery);