var app = app || {};

(function ($) {
        'use strict';


	app.AppView = Backbone.View.extend({

		initialize: function  () {
			console.log('AppView is initialized.');
			this.collection  = new app.Players();
			this.collection.fetch({reset: true});

			this.gameCollection = new app.Games();
			//this.gameCollection.fetch({reset: true});
			
			//this.listenTo(this.collection, 'gameStarted', this.showGame);
			this.listenTo(this.gameCollection, 'add', this.showGame);

			this.listenToOnce(this.collection, 'add', this.showPlayer);
			this.listenToOnce(this.collection, 'loggedin', this.showPlayer);
			this.listenTo(this.collection, 'reset', this.render);

			this.userName = this.$('#userName');
			this.currentGames = this.$('#currentGames');			
	      	//socket = io.connect('https://completethesentence.com/');
	      	//this.router = new app.AppRouter;
		},

		events: {
			"click #login": "loginPlayer",
			"click #btn-success": "requestDialog"
		},

		showPlayer: function(player) {
			console.log('showPlayer invoked');
			var playerView = new app.PlayersView({model: player});
            this.userName.append(playerView.render().el);
            //this.showGame(player);
		},

		showGame: function(player) {
			var gc = this.gameCollection;
			console.log(player);
			var source = $("#gamelist").html();
			var thisplayer = player;
			Handlebars.registerHelper('list', function(thisplayer, options) {
			  var games = gc.where({p1url: player.id});
			  var out = "<ul>";
			  for(var i=0, l=games.length; i<l; i++) {
			    out = out + "<li>" + options.fn(games[i]) + "</li>";
			  }

			  return out + "</ul>";
			  //return '<a href="/facebook/players/' + thisplayer.id + '/games/' + this.id + '">' + options.fn(this) + '</a>';
			});
			var template = Handlebars.compile(source);
			var games = this.gameCollection.where({p1url: player.id});
			this.currentGames.append(template(games));
            /*Handlebars.registerHelper('link', function(thisplayer, options) {
              var games = gc.where({p1url: player.id});
			  var out = "<ul>";
			  for(var i=0, l=games.length; i<l; i++) {
			    out = out + "<li>" + options.fn(games[i]) + "</li>";
			  }

			  return out + "</ul>";
			});
			var games = this.gameCollection.where({p1url: player.id});
			console.log('showGame invoked');
			var source = $("#gamelist").html();
			var context = games;
			console.log(context);
			var template = Handlebars.compile(source);
			var html = template(context);
			//var gameItem = new app.gameItem({model: game});*/
            //this.currentGames.append(.render().el);
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

					var matchedGame = (gcollection.where({player2: Number(currentUser)}) ||   
							gcollection.where({player1: Number(currentUser)}))
						&& (gcollection.where({player2: Number(response.to)}) || 
							 gcollection.where({player1: Number(response.to)}));
					console.log(matchedGame.length + ' matches were found: ');
					console.log(matchedGame);

					if (matchedGame.length == 0) {
						gcollection.create(
							{
								game_id: Number(response.request),
								player1: Number(currentUser),
								player2: Number(response.to),
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

			  	}
			  	else {
			  		//socket.emit('join', {status: 'not_joined'});
					console.log('No player selected, response is ' + response.to);
			  		}
			};
		},

		/*playersgames: function(player){
			var games = this.gameCollection.where({p1url: player.id});
			return games;
		},

		/*gamelist: function(game){
			var glist = this.gameCollection.where({p1url: game.p1url});
			console.log(game.p1url);
			console.log(glist);
		},*/


	    // render library by rendering each book in its collection
	    /*renderList: function() {
			var playersGames = this.gameCollection.where({player1: Number(currentUser)}) ||
				this.gameCollection.where({player2: Number(currentUser)});
			if (playersGames.length > 0){
				this.gameCollection.each(function( game ) {
	            	this.renderGame( game );
	        	}, this );
			} else {
				console.log('Player has no active games.');
				//can later populate a view that says "Invite a friend to play to get started"
			}

		},*/

	    // render a book by creating a BookView and appending the
	    // element it renders to the library's element
	    renderGame: function(game) {
	        var gameitem = new app.gameItem({model: game});
	        this.$el.append(gameitem.render().el);
	    }

	});
})(jQuery);
// Congratulations!! You got the game data to save to the player data :)
// Next, check if the game is new or not and either save it or console log that game is already
// started.  Then display the games on the players view - from the games list!

//Need it to first seach the games collection for the game_id with player1 and player2 in there,
//then check the player.attributes.games for that game_id.