(function ($) {
        'use strict';

	app.gamesListView = Backbone.View.extend({

		el: "#currentGames",

		template: Handlebars.compile(
		/*	'<h3>Your game with:</h3>' +
			'<ul>' + 
			'{{#each models}}<li>{{attributes.player2}}</li>{{/each}}' +
			'</ul>' */
			'<h3>Test</h3>'
		),

		events: {
			//will need to trigger events on button clicks from games but should wait to see how it all 
			//goes together. 

		},

		initialize: function  () {
			console.log('gamesListView has been initialized');
			this.render();
			//this.model.save(this.setPlayerData(), {patch: true});
			//this.model.bind("change:loggedin", this.render, this);
			
			//this.listenTo(this.collection, "change", this.render);
			//this.listenTo(this.collection, "reset", this.render);
			//this.listenTo(this.collection, "add", this.render);
		//	socket = io.connect('https://completethesentence.com/');
		},

		render: function(){
			this.$el.html(this.template);
		}

//		pullGame: function(){
//			if (attributes.games )
//		}

//Need to make sure we pull only the games on the player's model, then sort out how the game will
//trigger the url for the appropriate game.

	});

})(jQuery);