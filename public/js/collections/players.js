var app = app || {};

(function () {
        'use strict';

	var Players = Backbone.Collection.extend({
		comparator: 'fb_id',
		model: app.playerModel,
		url: '/players',

		initialize: function(){
	    console.log('The Players collection has been initialized.');
	  	},


		completed: function() {
	      return this.filter(function( games ) {
	        return games.get('completed');
	      });
	    },

	    remaining: function() {
	      return this.without.apply( this, this.completed() );
	    }
	});

  app.players = new Players();
})();