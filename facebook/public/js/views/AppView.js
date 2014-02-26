var app = app || {};

(function ($) {
 //       'use strict';


	app.AppView = Backbone.View.extend({

		initialize: function  (options) {
			console.log('AppView is initialized.');


			this.collection  = new app.Players();
			this.collection.fetch({reset: true});
			
			this.gameCollection = new app.Games();
			//this.gameCollection.fetch({reset: true});

			//this.listenTo(this.collection, 'gameStarted', this.showGame);
			this.listenTo(app.AppRouter, 'playerOn', this.test);
			this.listenTo(app.AppRouter, 'inGame', this.play);

			this.listenToOnce(this.collection, 'add', this.showPlayer);
			this.listenToOnce(this.collection, 'loggedin', this.showPlayer);
			this.listenTo(this.collection, 'reset', this.render);

			this.userName = this.$('#userName');
			this.currentGames = this.$('#currentGames');	
			this.main = this.$('#main');	

			//socket = io.connect('https://completethesentence.com/');
		},

		events: {
			"click #login": "loginPlayer",
			"click #btn-success": "requestDialog"
		},

		test: function(id){
			console.log('test function called from router with id ' + id);
		},

		showPlayer: function(player) {
			console.log('showPlayer invoked');
			var playerView = new app.PlayersView({model: player});
            this.userName.append(playerView.render().el);
            //this.showGame(player);
		},

		play: function(game){
			console.log('Found ' + game);
			var gameview = new app.gameView({model: game});
			this.main.append(gameview.render().el);
		},

		setPlayerData: function (){
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

		loginPlayer: function (){
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
			console.log(currentUser);
			console.log(player);
			this.gameCollection.fetch({reset: true});
			console.log('loginPlayer has been invoked');
			if (player == undefined){
				console.log('New Player is about to be posted.');
				this.collection.create(this.setPlayerData(),
					{
			      	success: function (player) {
			      		var model = new app.playerModel();
			      		model.renderPlayer(player);
						console.log('Creating new model with URL: ' + player.id);
						//this.playersgames(player);
				    }
				});	
			} else {
				var thisplayer = this.collection.get(player);
				this.collection.renderPlayer(thisplayer);
				console.log('Retrieved existing player ' + player.id);
				//this.playersgames(player);
			}
		},

		requestDialog: function(){
			FB.ui({method: 'apprequests',
		     message: 'Join me to tell a crazy story!' 
		    }, requestCallback);

			var player = this.collection.findWhere({fb_id: Number(currentUser)});
	  		var x = player.id;
			var gcollection = this.gameCollection;
			//this.gameCollection.fetch({reset:true});
			var that = this;
			var pcollection = this.collection;

		  	function requestCallback (response){
		  		//players.fetch({reset: true});
	  			//var player = pcollection.findWhere({fb_id: Number(currentUser)});
	  			//var x = player.id;
			  		//socket.emit('join', {status: 'joined'});
		  		
		  		if (response.to !== undefined) {
					console.log(response);

					var p2n = String(response.to);
					FB.api(p2n, function (info){
						//{
							//window.fbn = info.name;
							//console.log(info);
						//}, createGame
					//);	

					//function (info){
						console.log('player 2 name is : ' + info.name);
						//console.log('Or fbn is ' + window.fbn);
						var t = gcollection.where({player1: Number(response.to)}) 
						&& gcollection.where({player2: Number(currentUser)});
						var s = gcollection.where({player1: Number(currentUser)}) 
						&& gcollection.where({player2: Number(response.to)});
						var matchedGame = [];
						if (t.length != 0) {
							matchedGame.push(t);
						} else if (s.length != 0) {
							matchedGame.push(s);
						}
						console.log(matchedGame.length + ' matches were found: ');
						console.log(matchedGame);				

						if (matchedGame.length == 0) {

							gcollection.create(
								{
									game_id: Number(response.request),
									player1: Number(currentUser),
									player1_name: name,
									player2: Number(response.to),
									player2_name: info.name,
									complete: false,
									active: false,
									p1url: x
								},
								{
					    			success: function(game){
					    				//var model = new app.gameModel();
					    				//model.renderGame(game);
					    				console.log('Saving game data for id: ' + game.id);
					    				var player = pcollection.findWhere({fb_id: Number(currentUser)});
					    				pcollection.savegame(game, player);
					    				//that.gamelist(game);
					    			}
					    		}
				    		);
						} else {
							console.log('This game already exists.');
						}
					});										
			  	}
			  	else {
			  		//socket.emit('join', {status: 'not_joined'});
					console.log('No player selected, response is ' + response.to);
			  		}
			};
		},


	});
})(jQuery);