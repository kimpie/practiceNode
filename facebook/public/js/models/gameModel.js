var app = app || {};

(function () {

/*	Backbone.Model.prototype.forward = function (attribute, subModel, options) {
	  var self = this; // parent model
		var property = (options && options.property) ?
			options.property : attribute;
		self[property] = subModel; // save the subModel in the specified property
		subModel.set(self.get(attribute)); // add any existing data to the subModel
		self.on("change:" + attribute, function(model, value, options){
			subModel.set(value, options);
		});

		// Implement here all methods on the child that you need to trigger change
		// events up in the rest of the model tree.
		// 
		// For example, here is how you could implement the "add" function for
		// Backbone.Collection.
		subModel.add = function (model, options) {
			var collection = _.clone(self.get(attribute));
			collection.push(model.attributes);
			self.set(attribute, collection);
		};
	};*/
 
	app.gameModel = Backbone.Model.extend({

		defaults: {						
			game_id: '',
			complete: false,
			active: true,
			round_turn: '',
			word_turn: '',
			place: '',
			round: [],
			players: []
		},

		idAttribute: '_id',
		
		initialize: function(options){
			/*Use this code for a unique gameid:
				function generateUIDNotMoreThan1million() {
				    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
				}
			*/
			//iterate through the rounds, if level_one position 1 url is x 

//			this.forward("round", new app.round());

			_.bindAll(this, 'rotateTurn', 'saveData', 'getRound', 'checkRounds', 'addRounds', 'saveRound', 'setData', 'url');
			console.log('gameModel received options:');
			console.log(options);
			console.log('and options id is: ' + options._id);

			if (options != undefined){
				if(location.hash.indexOf('games') !== -1){
					var g = location.hash.indexOf('games') - 11;
				} else {
					var g = location.hash.length;
				}
				this.y = location.hash.substr(10, g);
				this.x = options._id;
	
			} else {
				this.y = undefined;
			}	
			/*if(location.hash.indexOf('games') !== -1){
				var g = location.hash.indexOf('games') - 2;
			} else {
				var g = location.hash.length;
			}
			var insertUrl = location.hash.substr(1, g);
			console.log(insertUrl);
			this.url = '/facebook' + insertUrl + '/games/' + options.id;*/
			app.AppView.vent.on('example', function (info){ console.log(info + ' from socket!'); });
			app.AppView.vent.on('updateGameInfo', this.updateGameInfo, this);
			app.AppView.vent.on('removeGame', this.changeActive, this);
			app.AppView.vent.on('requestNewGame', this.rng, this);
		  	app.AppView.vent.on('loadPlayers', this.addPlayers, this);
			//console.log('GameModel initialized with player: ' + this.y + 'and game: ' + this.x);
		},

		/*url: function(){
			if(location.hash.indexOf('games') !== -1){
				var g = location.hash.indexOf('games') - 2;
			} else {
				var g = location.hash.length;
			}
			var insertUrl = location.hash.substr(1, g);
			console.log(insertUrl);
			return '/facebook' + insertUrl + '/games/' + this.id;
		},*/

		getRound: function(path){
			var p = path.split('/'),
				onRound = this.attributes.round[p[1]];
			console.log(onRound);
			if(onRound.complete == true){
				console.log('show completed round info');
			} else if (onRound.story == '' || onRound.story == undefined){
				app.AppView.vent.trigger('getCard', p[1]);
			} else {
				app.AppView.vent.trigger('round', p[1]);
			}
		},

		checkRounds: function(){
			console.log('inside checkRounds');
			var rounds = this.attributes.round,
				rnum;
			function findActive(element,index,array){
				console.log('iterating through round: ' + element.number);
			    if (element.in_progress){
				    rnum = element.number;
				    console.log('round in progress: ' + rnum);
			    }			    
			};
			rounds.forEach(findActive);
			return rnum;
		},

		saveRound: function(){
			this.x = this.id;
			if(this.attributes.round.length == 0){
				this.save(this.addRounds(),
					{
						success: function(info){
							console.log('successfully saved new rounds:');
							console.log(info);
					}
				});
			} else {
				console.log('no need to save, rounds are there');
			}
		},

		addRounds: function(){
			console.log(this);
			var gUrl = '#/players/' + this.y + '/games/' + this.id + '/round/';
			var that = this;
			var r = this.attributes.round;
			var n;
			if(r.length == 0){
			    console.log('round length 0');
			    var addrounds = 6;
			    for(var i=0;i<addrounds; i++){
		
					if(i < 3){
			            console.log('in l1 ' + i);
			            n = {
			            	'number': i,
							'level_one': true,
							'url': gUrl + i
						};
						r.push(n);
					} else if (i >= 3 && i < 5){
			            console.log('in l2 ' + i);
			            n = {
			            	'number': i,
							'level_two': true,
							'url': gUrl + i
						};
						r.push(n);
					} else {
				        console.log('in l3 '+ i);
				        n = {
				        	'number': i,
							'level_three': true,
							'url': gUrl + i
						};
						r.push(n);
					}
				}
			}
		},

		addPlayers: function(game, to){
			var thisgame = game,
				to = to;
			console.log(to);
			console.log(game);
			var modelPlayers = thisgame.attributes.players;
			var playerInfo = {};
			for ( var i = 0; i < to.length; i++){
			    FB.api(to[i], function (info){
					    playerInfo = {
					        'name': info.name, 
					        'fb_id': info.id,
					        'points': 0
					    }; 
				});
			    modelPlayers.push(playerInfo);
			}
		},

		changeActive: function(model, player){
  			model.save({
  				active: false
  			},{
  				success: function(game){
  					console.log('updated the active state of the model to ' + game.attributes.active);
  				}
  			});

		},

		updateGameInfo: function(game, playerid){
			/*if (game.length > 1){
  				var  games = game;
  				for (var i = 0; i < games.length; i++){
  					this.saveId(games[i]);
  				}
  			} else {
  				this.saveId(game);
  			}
			
  			function saveId(game, playerid){*/
  			if (playerid == game.attributes.p1url){
  				var p2id = "";
  			} else {
				var p2id = playerid;
  			}
  				
  				console.log('updateGameInfo received playerid: ' + p2id + ' for game ' + game.id);
  				this.save({
  					p2url: p2id
  				},{
  					success: function(game){
  						console.log('successfully updated game ' + game.id + ' with p2url ' + game.attributes.p2url);
  					}
  				});
  			//}
		},

		rotateTurn: function(info){


			if (info.round_turn){
				//get new player for next ROUND turn
				var pt = this.attributes.round_turn;
			} else {
				//get new player for next WORD turn
				var pt = this.attributes.word_turn;
			}
			var t,
				m,
				plist = this.attributes.players;
			function nextTurn(element, index, array){
				if (element.name == pt){
					if ((index + 1) == array.length){
						m = 0;
					} else {
						m = index + 1;
					}
				t = array[m].name;
				}    
			}

			plist.forEach(nextTurn);
			return t;
		},

		setData: function(info){
			console.log(info);
			console.log(info.level);
			var roundx = this.attributes.round[info.level];

			if(info.word_countdown == 0){
				Object.defineProperty(roundx, "in_progress", {value : false,
                               writable : true,
                               enumerable : true,
                               configurable : true});
				Object.defineProperty(roundx, "complete", {value : true,
	                               writable : true,
	                               enumerable : true,
	                               configurable : true});
			}

			Object.defineProperty(roundx, "story", {value : info.story,
                               writable : true,
                               enumerable : true,
                               configurable : true});
			Object.defineProperty(roundx, "card", {value : info.card,
                               writable : true,
                               enumerable : true,
                               configurable : true});
			Object.defineProperty(roundx, "in_progress", {value : info.in_progress,
                               writable : true,
                               enumerable : true,
                               configurable : true});
			Object.defineProperty(roundx, "word_turn", {value : info.word_turn,
                               writable : true,
                               enumerable : true,
                               configurable : true});
			Object.defineProperty(roundx, "word_countdown", {value : info.word_countdown,
                               writable : true,
                               enumerable : true,
                               configurable : true});
			Object.defineProperty(roundx, "review", {value : info.review,
                               writable : true,
                               enumerable : true,
                               configurable : true});

			console.log(roundx);
			return{
				word_turn:info.word_turn,
				round_turn: info.round_turn
			}
		},

		saveData: function(info){
			console.log(info);
			this.y = info.playerId;
			this.x = info.room;
			var that = this;
			this.save(this.setData(info),{
				success: function(game){
					if(game.attributes.round[info.level].complete == true){
						app.AppView.vent.trigger('playGame', game);
					} else {
						app.AppView.vent.trigger('home');
					}
					var gp = game.attributes.players;
					function update(element, index, array){
						console.log(element.fb_id);
						console.log(info.level);
						var playerID = element.fb_id;
						console.log('update fn on player id: ' + playerID);
					    app.AppView.vent.trigger('updatePlayer', playerID, game, info.level);
					};
					gp.forEach(update);
				}
			});
		},

		url: function(){
			if (this.y !== undefined){
				console.log('gameModel player url is ' + this.y);
				console.log('gameModel url is ' + this.x);
				var that = this;
				if (that.x !== undefined){
					console.log('gameModel player url for that.y is ' + that.y);
					console.log('gameModel game url is ' + that.x);
					return '/facebook/players/' + that.y + '/games/' + that.x;
				} else {
					return '/facebook/players/' + that.y + '/games';
				}

			} else {
				return '/facebook/players/' + 'x' + '/games';
			}
		}

	});

})();

/*
Game play needs to be managed for users online and live:

Play for online user:
1. Accept or initiate game by accepting invite or inviting players
	1a - controller doesn't matter in online game.  Every player is treated the same.
2. Player first invited starts the round by seleceting a card 
	and hitting the start button
3. Start button begins the round by allowing player to enter a word within 30 seconds, sequentially
4. After they enter their word, its saved to game model and signals next player that its their turn
	4a - When its not a player's turn their input is disabled and screen shows who's turn it is.
	4b - Each player has 30 seconds to enter their word. If its not entered, they lose their turn and the next player enters their word.
5. Round_Turn stays same, only word_turn is updated until end of round.
6. Round ends when players reach 15 words.
7. At end of round, round_turn is updated to next player and process starts over at #3.

Play for live user:
1. Accept or initiate game by accepting invite or inviting players
2. Player first invited starts the round by seleceting a card 
	and hitting the start button
3. Start button begins the round which lasts for 60 seconds
4. The player that is the controller(or the one who started the game) is allowed to enter words
	continuously for that 60 seconds.  
4. Nothing is saved until the end of the round.  The sentence and card are saved then.
5. word_turn is used to assign the word in order of the player list so it will be saved according to player.
6. Round ends when time is up.
7. At end of round, round_turn is updated to next player and process starts over at #3.

Game Model knows if game is live or online - it signals to the view what to display.
Game view receives user input and sends to model to deicde what to do next. 

Logic:
1. When gameView initializes it checks whether the game is live or online.
	1a - if live, view loads 
*/