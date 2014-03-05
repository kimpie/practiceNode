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
			this.listenTo(app.AppRouter, 'playerOn', this.headerurl);
			this.listenTo(app.AppRouter, 'inGame', this.play);

			//this.listenToOnce(this.collection, 'add', this.showPlayer);
			this.listenToOnce(this.collection, 'loggedin', this.showPlayer);
			this.listenTo(this.collection, 'reset', this.render);

			this.userName = this.$('#userName');
			this.main = this.$('#main');	
			this.header = this.$('#headerUrl');

			//socket = io.connect('https://completethesentence.com/');
		},

		events: {
			"click #login": "loginPlayer",
			"click #btn-success": "requestDialog"
		},

		headerurl: function(id){
			console.log('headerurl called with id: ' + id);
			this.header.html('<a type="button" class="btn btn-success btn-lg" href="/facebook/#players/'+ id + '">All Games</a>');
			var player = this.collection.findWhere({_id: id});
			console.log('headerurl player: ');
			console.log(player);
			this.showPlayer(player);
		},

		showPlayer: function(player) {
			console.log('showPlayer invoked with');
			console.log(player);
			playerOpen = true;
			var playerView = new app.PlayersView({model: player});
            this.main.html(playerView.render().el);
            //this.showGame(player);
		},

		play: function(gameid){
			console.log('play in appview received gameid: ' + gameid);
			var game_model = this.gameCollection.findWhere({_id: gameid});
			console.log('AppView was passed game info: ');
			console.log(game_model);
			if (game_model.attributes.player1 == Number(currentUser)){
				console.log('showing inGame1');
				var gameview = new app.GamesView({model: game_model});
				this.main.html(gameview.render().el);
			} else {
				console.log('showing inGame2');
				var gameview2 = new app.GamesView2({model: game_model});
				this.main.html(gameview2.render().el);				

			}
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
				this.gameCollection.fetch({reset: true});	
			} else {
				var thisplayer = this.collection.get(player);
				this.collection.renderPlayer(thisplayer);
				console.log('Retrieved existing player ' + player.id);
				this.gameCollection.fetch({reset: true});
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
			this.gameCollection.fetch({reset:true});
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
						
						var player2 = pcollection.findWhere({fb_id: Number(response.to)});
				  		if (player2 !== undefined){
					  		var z = player2.id;
				  		} else {
				  			pcollection.create({
				  				fb_id: Number(response.to),
				  				name: info.name
				  			}, 
				  			{
				  				success: function (player2){
				  					z = player2.id;
				  				}

				  			});
				  		}

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
									p1url: x,
									p2url: z
								},
								{
					    			success: function(game){
					    				//var model = new app.gameModel();
					    				//model.renderGame(game);
					    				console.log('Saving game data for id: ' + game.id);
					    				var player = pcollection.findWhere({fb_id: Number(currentUser)});
					    				var player2 = pcollection.findWhere({fb_id: Number(response.to)});
					    				pcollection.savegame(game, player, player2);
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
		}

/*	render: function(){
		if (playerOpen == true){
			this.
		}
	}*/

	});
})(jQuery);