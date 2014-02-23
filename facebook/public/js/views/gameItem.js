var app = app || {};

(function ($) {
        'use strict';

	app.gameItem = Backbone.View.extend({

		tagName: 'li',
		id: 'gameItem',

		template: Handlebars.compile(
			'<h4>Game with {{player2}}</h4>'
		),

		/*events: {
			'click .toggle': 'togglecompleted',
			'click .destroy': 'clear'
		},*/

		initialize: function  () {
			console.log('gameItem view initialized.');
			this.listenTo(this.model, "change", this.render);
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));

			//this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
			//this.toggleVisible();                                             // NEW
			
			return this;
		}

	    /*toggleVisible : function () {
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
	    },*/

	});
})(jQuery);