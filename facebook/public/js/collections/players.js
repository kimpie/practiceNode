var app = app || {};

(function () {
        'use strict';

	app.Players = Backbone.Collection.extend({
		//comparator: 'id',
		model: app.playerModel,
		url: '/players',

		initialize: function(){
	    console.log('The Players collection has been initialized.');
	  	},

	  	renderPlayer: function (player){
	  		console.log('renderPlayer triggered with player id: ' + player.id);
	  		this.trigger('loggedin', player);
            app.AppRouter.navigate('/players/' + player.id, true);
	  		//this.vent.trigger("player:loggedin", player);
	  	},

	  	savegame: function(game, player){
	  		var model = this.get(player);
	  		var player2model = this.findWhere({fb_id: game.attributes.player2});
	  		var that = this;
	  		if (player2model != undefined){
	  			console.log('Data for player2: ');
		  		console.log(player2model);
		  		model.setGameData(game, player, player2model);
	  		} else {
	  			this.create({
	  				fb_id: game.attributes.player2,
	  				name: game.attributes.player2_name
	  			}, 
	  			{
	  				success: function (player2){
	  					console.log('To save game to player2, first created the player ' + player2.id);
		  				var player2model = that.get(player2);
			  			model.setGameData(game, player, player2model);
	  				}

	  			});
	  		}
	  		
	  		
	  	},

	  	showGame: function (game){
	  		console.log('showgame1');
	  		this.trigger('createGame', game);
	  		console.log('showgame2');
	  		this.trigger('gameStarted', game);
	  		console.log('showgame3');
	  	}


	});

 // app.players = new Players();
})();