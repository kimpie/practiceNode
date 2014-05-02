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
	  	app.AppView.vent.on('playersTurn', this.turn, this);
	  	},

	  	turn: function(turn, game){
	  		console.log('turn triggered in players collection');
	  		var player = this.findWhere({fb_id: Number(game.attributes.player1)});
	  		var player2 = this.findWhere({fb_id: Number(game.attributes.player2)});
	  		app.AppView.vent.trigger('updateTurn', player, player2, game);
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
			if (currentUser) {
				console.log(this);
				var player = this.findWhere({fb_id: Number(currentUser)});
				console.log(player);
				console.log('loginPlayer has been invoked');
				if (player == undefined){
					console.log('New Player is about to be posted.');
					that.createPlayer();
				} else {
					var thisplayer = this.get(player);
					//this.renderPlayer(thisplayer);
					var pcGames = thisplayer.attributes.games;
					app.AppView.vent.trigger('launchFetch', thisplayer, pcGames);
			  		//this.trigger('loggedin', player);
					//this.playersgames(player);
				}
			}				  		
	  	},

	  	renderPlayer: function (player){
	  		console.log('renderPlayer triggered with player id: ' + player.id);
	  		app.AppView.vent.trigger('loggedin', player);
            //app.AppRouter.navigate('/players/' + player.id, true);
	  		//this.vent.trigger("player:loggedin", player);
	  	},

	  	savegame: function(game, player1, player2){
	  		console.log('SaveGame player1 is ' + player1 + ' and player2 is : ' + player2);
	  		if (player2 !== "" && player2 !== undefined){
			//Scenario 1 : Both players exist in DB.	
				console.log('SAVEGAME BOTH on players collection received info: ');
		  		console.log(game);
		  		var playermodel = this.get(player1);
		  		var player2model = this.get(player2);
		  		playermodel.setGameData(game, playermodel);
		  		player2model.setGameData2(game, player2model);	
	  		} else if (game.attributes.player1 == Number(currentUser) ) {
			//Scenario 2: Player1 is the currentUser who creates the game by inviting a new user.	
				console.log('SAVEGAME ONE on players collection received game info: ');
		  		console.log(game);
		  		var playermodel = this.findWhere({fb_id: Number(currentUser)});
		  		console.log('and player1 info: ');
		  		console.log(playermodel);
		  		playermodel.setGameData(game, playermodel);
	  		} else if (game.attributes.player2 == Number(currentUser) ) {
	  		//Scenario 3 : Player2 is logging in and the game is getting saved to their model.	
	  			console.log('SAVEGAME ONE on players collection received game info: ');
		  		console.log(game);
		  		var player2model = this.findWhere({fb_id: Number(currentUser)});
		  		console.log('and player2 info: ');
		  		console.log(player2model);
		  		player2model.setGameData2(game, player2model);
	  		}
	  	}

	});

})();