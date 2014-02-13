var app = app || {};

(function ($) {
        'use strict';

	app.GamesView = Backbone.View.extend({

		//el: '#currentGames',
		
		initialize: function() {
	        this.gameCollection = new app.Games();
	        this.gameCollection.fetch({reset: true});
	        this.render();
	    },

	    createGame: function (game){
	    	console.log('createGame invoked.');
	    	this.gameCollection.create(this.setGameData(),
	    		{
	    			success: function(game){
	    				console.log('Saving game data for id: ' + game.id);
	    				var model = new app.gameModel();
	    				model.renderGame(game);
	    			}
	    		});
	    },

	    setGameData: function(game){
	    	return{
	    		game_id: response.request,
	    		player1: currentUser,
	    		player2: response.to,
	    		complete: false
	    	};
	    },

	    // render library by rendering each book in its collection
	    render: function() {
	        this.gameCollection.each(function( game ) {
	            this.renderGame( game );
	        }, this );
	    },

	    // render a book by creating a BookView and appending the
	    // element it renders to the library's element
	    renderGame: function( game ) {
	        var listgame = new app.listGame({
	            model: game
	        });
	        this.$el.append( listgame.render().el );
	    }

	
	});

})(jQuery);