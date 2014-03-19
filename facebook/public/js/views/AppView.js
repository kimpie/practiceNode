var app = app || {};

(function ($) {
 //       'use strict';

	app.AppView = Backbone.View.extend({

//------Initialize AppView by fetching the players collection and listening for events
//------from the router and the players collection upon login 
		initialize: function  (options) {
			console.log('AppView is initialized.');

			this.collection  = new app.Players();
			this.collection.fetch({reset: true});
			
			this.gameCollection = new app.Games();

			this.listenTo(app.AppRouter, 'playerOn', this.headerurl);
			this.listenTo(app.AppRouter, 'inGame', this.play);

			this.listenToOnce(this.collection, 'loggedin', this.showPlayer);
			this.listenTo(this.collection, 'reset', this.render);

			this.userName = this.$('#userName');
			this.main = this.$('#main');	
			this.header = this.$('#headerUrl');

		},

//------Two events, when a user logs in to FB and when they invite friends to join
		events: {
			"click #login": "loginPlayer",
			"click #btn-success": "requestDialog"
		},

//------When the page is refresehed on the players page, the router sends an event to appView
//------to update the state of the app.
		headerurl: function(id){
			console.log('headerurl called with id: ' + id);
			this.header.html('<a type="button" class="btn btn-success btn-lg" href="/facebook/#players/'+ id + '">All Games</a>');
			var player = this.collection.findWhere({_id: id});
			console.log('headerurl player: ');
			console.log(player);
			this.showPlayer(player);
		},

//------Upon login, showPlayer receives the player model and initializes the PlayersView
		showPlayer: function(player) {
			console.log('showPlayer invoked with');
			console.log(player);
			playerOpen = true;
			var playerView = new app.PlayersView({model: player});
            this.main.html(playerView.render().el);
            //this.showGame(player);
		},

//------Upon friend invite to start game, play receives game model and pass it to games view
//------to initialize, if player 1 is logged in gameview opens, if player 2 gameview 2.
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

//------Once FB registers the player has logged in, they trigger the click on loginPlayer
//------for our database to find or register the player.
		loginPlayer: function (){
			this.collection.loginPlayer();
			this.gameCollection.fetch({reset: true});
		},

//------FB api used to invite friends to play game.
		requestDialog: function(){
			FB.ui({method: 'apprequests',
		     message: 'Join me to tell a crazy story!' 
		    }, requestCallback);

//--------Need both player and game inforamtion to create game with.
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
	  		var x = player.id;
			var gcollection = this.gameCollection;
			this.gameCollection.fetch({reset:true});
			var that = this;
			var pcollection = this.collection;

		  	function requestCallback (response){
		  		
		  		if (response.to !== undefined) {
		  			console.log(response);
		  			console.log(response.to.length);
		  			
		  			var to = response.to;
		  			function createGame(to){
						var p2n = String(to);

						function assignGameData(player2, info){
							console.log(player2);
							var p2id = player2.id;
							console.log('player 2 name is : ' + info.name);
							console.log('TEST player2 id is ' + p2id);

							//See if any games already exist between the two players.
							var t = gcollection.where({player1: Number(to)}) 
							&& gcollection.where({player2: Number(currentUser)});
							var s = gcollection.where({player1: Number(currentUser)}) 
							&& gcollection.where({player2: Number(to)});
							var matchedGame = [];
							if (t.length != 0) {
								matchedGame.push(t);
							} else if (s.length != 0) {
								matchedGame.push(s);
							}
							console.log(matchedGame.length + ' matches were found: ');
							console.log(matchedGame);				

							if (matchedGame.length == 0) {
								//No games exist between two players, create a new game.
								gcollection.create(
//								var newGame = app.Games.extend({noIoBind:true});
//								var attr = 
									{
										player1: Number(currentUser),
										player1_name: name,
										player2: Number(to),
										player2_name: info.name,
										complete: false,
										active: false,
										turn: Number(currentUser),
										p1url: x,
										p2url: p2id
//									};
//								var _newGame = new newGame(attr);
//								_newGame.save();
									},
									{
						    			success: function(game){
						    				console.log('Saving game data for id: ' + game.id);
						    				var player = pcollection.findWhere({_id: x});
						    				var player2 = pcollection.findWhere({_id: p2id});
						    				//Pass data to save the game to the players model.
						    				pcollection.savegame(game, player, player2);
						    			}
						    		}
					    		);
							} //end of if matched game 
							else {
								console.log('This game already exists.');
							} // end of else matched game
						}; //End of assignGameData fn

						FB.api(p2n, function (info){
							
							var player2 = pcollection.findWhere({fb_id: Number(to)});
					  		if (player2 !== undefined){
						  		var z = player2.id;
						  		assignGameData(player2, info);
					  		} else {
					  			pcollection.create({
					  				fb_id: Number(to),
					  				name: info.name
					  			}, 
					  			{
					  				success: function (player2, info){
					  					console.log('player2 created with id of ' + player2.id + ' and name ' + info.name);
					  					assignGameData(player2, info);
					  				}
					  			});
					  		}
							
						}); //End of FB.api function	
					}; //End of fn createGame

//------------------Logic for creating games when multiple friends have been invited. 
		  			if (response.to.length > 1){
		  				var friends = response.to;
		  				for (var i = 0; i < friends.length; i++){
		  					createGame(friends[i]);
		  				}
		  			} else {
		  				createGame(response.to);
		  			}
		  			//End of response.to length if/else 

			  	} // End of if response.to 
			  	else {
			  		//socket.emit('join', {status: 'not_joined'});
					console.log('No player selected, response is ' + response.to);
		  		} //End of else response.to
			};  //End of function requestCallback
		} //End of requestDialog fn

	});

//----vent used as the Applications event aggregator.
	app.AppView.vent = _.extend({}, Backbone.Events);
	

})(jQuery);