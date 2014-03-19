var app = app || {};

(function () {
        'use strict';


	app.Players = Backbone.Collection.extend({
		model: app.playerModel,
		url: '/facebook/players',

		initialize: function(){
	    console.log('The Players collection has been initialized.');
	    _.bindAll(this, 'setPlayerData', 'createPlayer', 'loginPlayer', 'renderPlayer', 'savegame');
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
					//this.playersgames(player);
			    }
			});

	  	},

	  	loginPlayer: function(){
			if (currentUser) {
				var player = this.findWhere({fb_id: Number(currentUser)});
				console.log(currentUser);
				console.log(player);
				console.log('loginPlayer has been invoked');
				
				if (player == undefined){
					console.log('New Player is about to be posted.');
					this.createPlayer();
				} else {
					var thisplayer = this.get(player);
					this.renderPlayer(thisplayer);
					console.log('Retrieved existing player ' + player.id);
					//this.playersgames(player);
				}
			}	  		
	  	},

	  	renderPlayer: function (player){
	  		console.log('renderPlayer triggered with player id: ' + player.id);
	  		this.trigger('loggedin', player);
            app.AppRouter.navigate('/players/' + player.id, true);
	  		//this.vent.trigger("player:loggedin", player);
	  	},

	  	savegame: function(game, player, player2){
	  		var model = this.get(player);
	  		var player2model = this.get(player2);
	  		console.log(player2model);
	  		model.setGameData(game, player);
	  		player2model.setGameData2(game, player2model);	  		
	  	}


	});

})();