var app = app || {};

(function ($) {
 //       'use strict';

	app.AppView = Backbone.View.extend({
//------Initialize AppView by fetching the players collection and listening for events
//------from the router and the players collection upon login 
		initialize: function  (options) {
			console.log('AppView is initialized.');

			this.collection  = new app.Players();
			
			this.gameCollection = new app.Games();
			this.cc = new app.Contact();
			this.cardCollection = new app.Card();
			this.cardCollection.fetch({reset:true});

			this.listenTo(app.AppRouter, 'playerOn', this.getLocation);
			this.listenTo(app.AppRouter, 'inGame', this.play);
			this.listenTo(app.AppRouter, 'contact', this.contact);

			//app.AppView.vent.on('loggedin', this.getLocation, this);
			this.listenTo(this.collection, 'reset', this.render);

			app.AppView.vent.on('requestGame', this.requestDialog, this);
			app.AppView.vent.on('home', this.homeView, this);
			app.AppView.vent.on('playGame', this.play, this);
			//app.AppView.vent.on('getCard', this.cards, this);

			app.AppView.vent.on('launchFetch', this.go, this);
			app.AppView.vent.on('removeGame', this.removeGame, this);
			app.AppView.vent.on('updatePoints', this.updatePoints, this);
			app.AppView.vent.on('newGameRequest', this.processResponse, this);
			app.AppView.vent.on('inviteFriends', this.requestDialog, this);

			this.userName = this.$('#userName');
			this.main = this.$('#main');	
			this.home = this.$('#home');
			this.share = this.$('#share');
			this.game = this.$('#game');
			this.play = this.$('#play');
			this.mfs = this.$('#mfs');
			this.board = this.$('#board');
		},

		//------Two events, when a user logs in to FB and when they invite friends to join
		events: {
			"click #login": "loginPlayer",
			"click #home": "homeView",
			"click #contact" : "contact"

		},

		version: function(){
			var vv = new app.versionView();
			this.play.html(vv.render().el);
		},

		contact: function(){
			var cm = new app.contactModel();
			var cv = new app.contactView({model: cm});
			this.game.html(cv.render().el);
		},

		getLocation: function(playerid){
			this.homeView(playerid);
			//var player = this.collection.findWhere({fb_id: Number(currentUser)});			
			var url = location.hash.slice(10).split('/');
			var g = "";
			function games( element, index, array ){       
                 if (element == "games"){ 
					console.log('true');                     
					g = true;  
                 }
            };
            url.forEach(games);
			if (g){ 
				var game = url[2];
				this.play(game);
			} 

		},

		homeView: function(player){
			console.log('player received in homeView');
			console.log(player);
			var playermodel = this.collection.findWhere({fb_id: Number(currentUser)});
			app.AppRouter.navigate('#/players/' + playermodel.id)
			this.board.hide();
			var hv = new app.homeView({model: playermodel});
			this.play.html(hv.render().el);	
		},

		voteView: function(){
		//Creating the code to loop through the collection, randomly pull out a model 
		//and then send that model to the voteView, every 30 seconds.
		var gid = this.gameCollection.where({complete:true, share: true});
		
		var that = this;
		//fn that takes a collection and returns a model
		function grabmodel(collection){
			var model = that.gameCollection.get(collection[Math.floor(Math.random() * collection.length)]);
			return model;
		};	
		var randoModel = grabmodel(gid);
		var voteView = new app.VoteView({model: randoModel});
		this.nested.html(voteView.render().el);
		
		},

		go: function(player, pcGames){
			console.log('go in AppView');
			var player = player;
			var pcGames = pcGames;
			var that = this;
			this.gameCollection.fetch({reset:true, 
				success: function(){ 
					app.AppView.vent.trigger('checkForGames', player, pcGames);
					that.homeView(player);
				}
			});
		},

		updatePoints: function(fbid, points){
			var player = this.collection.findWhere({fb_id: Number(fbid)});
			app.AppView.vent.trigger('updatePlayer', player, points);
		},

		removeGame: function(model, player){
			var gameModel = model;
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
			app.AppView.vent.trigger('modelRemove', gameModel, player);
		},

//------Upon login, showPlayer receives the player model and initializes the PlayersView
		showPlayer: function(player) {
			console.log('showPlayer in AppView triggered');

		},

//------Upon friend invite to start game, play receives game model and pass it to games view
//------to initialize, if player 1 is logged in gameview opens, if player 2 gameview 2.
		play: function(game){
			console.log('play triggered from AppView with game: ');
			console.log(game);
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
			if(typeof game == "string"){
				var game_model = this.gameCollection.findWhere({_id: game});
			} else if (typeof game == "object"){
				var game_model = game;
			}
			var level = game_model.checkRounds();
			this.board.show();
			if(level != undefined){
				var gameview = new app.gameView({model: game_model});
				this.play.html(gameview.render().el);
		        var rv = new app.roundView({model: game_model.attributes.round[level]});
		        this.board.html(rv.render().el);
				app.AppRouter.navigate('#/players/' + player.id + '/games/' + game + '/round/' + level);
			} else {
				var gameview = new app.gameView({model: game_model});
				this.play.html(gameview.render().el);
				var bv = new app.boardView({model: game_model});
		        this.board.html(bv.render().el);
				app.AppRouter.navigate('#/players/' + player.id + '/games/' + game);
			}
		},

		/*cards: function(info, game){
			console.log('cards in AppView has card info: ' + info + ' and game info:');
			console.log(game);
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
			app.AppRouter.navigate('#/players/' + player.id + '/games/' + game.id + '/round/' + info +'/cards');
			this.cardCollection.randomCard(info);
		},*/

//------Once FB registers the player has logged in, they trigger the click on loginPlayer
//------for our database to find or register the player.
		loginPlayer: function (){
			console.log('loginPlayer');
			this.collection.fetch({reset:true, 
				success: function(collection){ 
					console.log('about to loginPlayer');
					collection.loginPlayer();
				}
			});
		},

//------FB api used to invite friends to play game.
		requestDialog: function(){
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
			var that = this;
			var ngv = new app.newGameSetup({collection: that.gameCollection});
			this.play.html(ngv.render().el);
			app.AppRouter.navigate('#/players/' + player.id + '/games');
		},

		processResponse: function(response, ginfo){
			var response = response,
				ginfo = ginfo,
				place = ginfo[0],
				people = ginfo[1];
	//	}
//--------PART 1: Need both player and game inforamtion to create game with. 
//					Only take action if players have been selected in response.to condition

			//Get the logged-in player's information, the one who has created the game.
			var player = this.collection.findWhere({fb_id: Number(currentUser)}),
	  			x = player.id;

	  		//Get all of the data for games ongoing.
			this.gameCollection.fetch({reset:true});
			var gcollection = this.gameCollection,
				that = this,
				pcollection = this.collection;
		  	
		  		
		  		//REVIEW if/else statment to check whether a friend has been requested, may not need this anymore
		  		if (response.to !== undefined) {

//--------PART 4: fn() logic to handle the information recevied from facebook in the response & setup game 		  		
	  			
		  			var to = response.to,
		  				playersList = [],
		  				playerInfo = {};
		  			//Runs this every time a new game is setup, gets necessary data and assigns it
		  			function createGame(to){
					//	var p2n = String(to);
						
						//For one opponenet, get the players id if they are in the database
						function assignGameData(info){
							var player2 = pcollection.findWhere({fb_id: Number(to)});
							if (player2 != undefined){
								var p2id = player2.id;
							} else {
								var p2id = undefined;
							}
							var x = info.name,
							    y = info.id,
							    playerInfo = {
							        'name': x, 
							        'fb_id': y,
							        'points': 0
							    };   
						    playersList.push(playerInfo);
					
							};
							//See if any games already exist between the two players. 
							//If not, send data for game creation to collection.
							
								 //End of assignGameData fn*/
						/*var pinfo = {
							'name' : player.attributes.name,
							'fb_id' : Number(currentUser),
							'points' : 0
						};
						playersList.push(pinfo);*/
//---------------PART 3: First piece of code called within createGame
//						Gets player 2's facebook data to assign their values to game							
						
						var gameinfo = {
									//players: playersList,
									place: place,
									complete: false,
									active: true
								}
						gcollection.createGame(gameinfo);
						//};
						for ( var i = 0; i < to.length; i++){
						    FB.api(to[i], function (info){
						        assignGameData(info); 
							});
						}
					};
					//	FB.api(p2n, function (info){
							
					  //			assignGameData(info);
				
					//	}); //End of FB.api function

						//See if any games already exist between the two players.
						function checkGame(info){
							var info = info;
							var match = {};
							function findMatch(info){
								var t = gcollection.findWhere({player1: Number(to), player2: Number(currentUser), active: true});
								var s = gcollection.findWhere({player1: Number(currentUser), player2: Number(to), active: true}); 
								if (t){
									var match = t;
								} else if (s) {
									var match = s;
								} else {
									var match = undefined;
								}
								if (match != undefined){
									var active = true;
								} else {
									var active = false;
								}
								return active;
							};

							var ifActive = findMatch(info);	
							if (ifActive) {
								console.log('This game already exists.');
								app.AppRouter.navigate('/players/' + x + '/games/' + match.attributes.id, true);
							} else {
								createGame(info);
							}
						};//End of checkGame fn() 

					

//---------------PART 2: First piece processsed inside the if/else response.to condition 
//						Logic for creating multiple games between two players
//						 when multiple friends have been invited. 
		  			if (response.to.length > 1){ //If more than one friend requested
		  				if (people == "One-on-One"){ //If more than one friend req and games are one-on-one
							var friends = response.to;
			  				for (var i = 0; i < friends.length; i++){
			  					checkGame(friends[i]);
			  				}	
		  				} else if (people == "Group"){  //If more than one friend req but game is for group
							console.log('more than one friend requested for the group game');
							//logic needed: FB.api needs to loop through the list and assignGameData for each
							//	Don't need to check if any games already exist with these people
							//GameInfo will be a little different
							createGame(response.to);
		  				} /// end of if/else if people		  				
		  			} else {
		  				console.log('one friend requested, game will be one-on-one');
		  				createGame(response.to);
		  			}//End of response.to length if/else 

			  	} // End of if response.to 
			  	else {
					console.log('No player selected, response is ' + response.to);
		  		} //End of else response.to

		}



	});
//----vent used as the Applications event aggregator.
	app.AppView.vent = _.extend({}, Backbone.Events);

})(jQuery);

