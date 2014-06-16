var app = app || {};

(function () {
        'use strict';


	app.Players = Backbone.Collection.extend({
		model: app.playerModel,
		url: '/facebook/players',

		initialize: function(){
	    console.log('The Players collection has been initialized.');
	    _.bindAll(this, 'setPlayerData', 'createPlayer', 'loginPlayer', 'renderPlayer', 'savegame');
	  	app.AppView.vent.on('gameSaved', this.savegame, this);
	  	app.AppView.vent.on('updatePlayer', this.turn, this);
	   	},

	  	turn: function(playerID, game){
	  		console.log('turn triggered in players collection ' + playerID);
	  		console.log(game);
	  		var player = this.findWhere({fb_id: playerID});
	  		console.log(player);
	  		app.AppView.vent.trigger('updateTurn', player, game);
	  	},

		setPlayerData: function (){
			console.log('setPlayerData has been called with data for ' + currentUser);
		    var x = new Date();
		    var currentTimeZoneOffsetInHours = x.getTimezoneOffset() / 60;
			return {
				fb_id: currentUser,
				first_name: first_name,
				last_name: last_name,
				name: name,
				city: city,
				url: currentUser,
				gender: gender,
				last_login: x
			};
		},

	  	createPlayer: function (){
			this.create(this.setPlayerData(),
				{
		      	success: function (player) {
		      		var model = new app.playerModel();
		      		model.renderPlayer(player);
					console.log('Creating new model with URL: ' + player.id);
					var pcGames = player.attributes.games;
					app.AppView.vent.trigger('launchFetch', player, pcGames);
			    }
			});

	  	},

	  	loginPlayer: function(){
	  		console.log('inside loginPlayer');
			if (currentUser) {
				console.log(this);
				var player = this.findWhere({fb_id: Number(currentUser)});
				console.log(player);
				console.log('loginPlayer has been invoked');
				if (player == undefined){
					console.log('New Player is about to be posted.');
					this.createPlayer();
				} else {
					var thisplayer = this.get(player);
					this.renderPlayer(thisplayer);
					var pcGames = thisplayer.attributes.games;
					app.AppView.vent.trigger('launchFetch', thisplayer, pcGames);
			  		//this.trigger('loggedin', player);
					//this.playersgames(player);
				}
			}				  		
	  	},

	  	renderPlayer: function (player){
	  		console.log('renderPlayer triggered with player id: ' + player.id);
	  		//app.AppView.vent.trigger('loggedin', player);
            app.AppRouter.navigate('/players/' + player.id);
	  		//this.vent.trigger("player:loggedin", player);
	  	},

	  	savegame: function(game){
	  		console.log('SaveGame players');
	  		console.log(game.attributes.players);
	  		var game = game;
	  		var gp = game.attributes.players;
	  		var that = this;
	  		for (var i=0; i < gp.length; i++){
	  			//for each player, first check if they're in the database
	  			// if not save them to db, then send game to model to be saved to player
	  			var player = that.findWhere({fb_id: Number(gp[i].fb_id)});
	  			console.log('saveGame iterating through: ' + gp[i].fb_id);
	  			if (player !== undefined && player !== ""){
	  				console.log('player in DB already');
	  				player.setGameData(game, player);
	  			} else {
	  				console.log('saivng player to db');
	  				that.create({
	  					name: gp[i].name,
	  					fb_id: gp[i].fb_id
	  				},{
	  					success: function(player){
	  						console.log('successfully created player');
	  						player.setGameData(game, player);
	  					}
	  				});
	  			}
	  		};
	  	} 

	});

})();