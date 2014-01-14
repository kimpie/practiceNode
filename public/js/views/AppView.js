var app = app || {};

(function ($) {
        'use strict';


	app.AppView = Backbone.View.extend({

		//el: '#app',
		
		initialize: function  () {
			console.log('AppView is initialized.');
			this.listenTo(app.players, 'add', this.showPlayer);
			this.userName = this.$('#userName');	
		/*	this.currentGames = this.$('#currentGames');
			this.inplay = this.$('#inPlay');
			this.login = this.$('#login');

			this.listenTo(app.PlayerModel, 'add', this.addPlayer);
			this.listenTo(app.players, 'add', this.addGame);

	      	socket = io.connect('https://completethesentence.com/');

	      	this.players.fetch();*/
		},

		events: {
			"click #btn-success": "requestDialog",
			"click #login": "loginPlayer"
		},


/*		alert: function () {
			console.log("Alert - The button is working!");
		}
*/

		showPlayer: function(player) {
			var playerView = new app.PlayersView({model: player});
			this.userName.append(playerView.render().el);

		},

		setPlayerData: function (){
		    var x = new Date();
		    var currentTimeZoneOffsetInHours = x.getTimezoneOffset() / 60;
			return {
				fb_id: currentUser,
				first_name: first_name,
				last_name: last_name,
				url: currentUser,
				name: name,
				city: city,
				gender: gender,
				last_login: x,
				id: null
			};
		},

		loginPlayer: function (){
			app.players.create(this.setPlayerData());
			console.log('We are now saving user data.');

		}

		/*postPlayer: function () {
			this.setPlayerData();	
			console.log('We are now saving user data.');
			var PlayerModel = new app.playerModel();
			PlayerModel.save(PlayerModel.attributes,
		      {
		      	success: function (model) {
							app.players.add(model);
							app.navigate('players/' + model.get('url'), {trigger: true});
			    }

		    });
		
		},*/


/*		addGame: function( games ) {
			var listView = new app.listGames({ model: PlayerModel });
			this.currentGames.append(listView.render().el );
	    },*/

		/*requestDialog: function () {
		  FB.ui({method: 'apprequests',
		     message: 'Make up a story with me at Complete the Sentence game!' 
		    }, requestCallback);
		  	
		  	function requestCallback (response){
			  	if (response.to !== undefined) {
			  		socket.emit('join', {status: 'joined'});
					console.log("Sent request to " + response);
					//game.create
					/*if (response.to && currentUser !=== currentGame){
			  			createGame 
				  	}
				  	else {
				  		alert('You\'re currently in a game with this Friend');
				  	}
			  	}
			  	else {
			  		socket.emit('join', {status: 'not_joined'});
					console.log('No player selected, response is ' + response.to);
			  	}
			};
		
			this.setGameData();	
			console.log('We are now saving game data.');
			this.model.save(this.model.attributes,
		      {
		      	success: function (model) {
							app.players.add(model);
							app.navigate('players/game/' + model.get('url'), {trigger: true});
			    }

		    });
		
		},

		setGameData: function (){
			this.model.set({
				games: [{

				}]
			});
		}*/


	});
})(jQuery);