var app = app || {};

(function () {

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

			app.AppView.vent.on('example', function (info){ console.log(info + ' from socket!'); });
			app.AppView.vent.on('updateGameInfo', this.updateGameInfo, this);
			app.AppView.vent.on('removeGame', this.changeActive, this);
			app.AppView.vent.on('requestNewGame', this.rng, this);
		  	app.AppView.vent.on('loadPlayers', this.addPlayers, this);
			//console.log('GameModel initialized with player: ' + this.y + 'and game: ' + this.x);
		},

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

		checkStage: function(){
			var gp = this.attributes.players;
			var stage;
			function getPlayer(element, index, array){
			  if (currentUser == element.fb_id){
			    console.log('found matching player: ' + element.name + ' ' + currentUser);
				stage = element.stage;
			  }

			};
			gp.forEach(getPlayer);

			return stage;
		},

		checkRounds: function(blank){
			console.log('inside checkRounds, checking for ' + blank);
			var rounds = this.attributes.round,
				rnum = [];
			function findActive(element,index,array){
				if (blank == 'complete'){
					var k = element.complete;
				} else if (blank == 'in_progress'){
					var k = element.in_progress;
				}
				console.log('iterating through round: ' + element.number +' ' + k);
			    if (k){
				    rnum.push(element.number);
				    console.log('round ' + k + ' is : ' + rnum);
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
						success: function(game){
							console.log('successfully saved new rounds:');
							console.log(game);
							app.AppView.vent.trigger('playGame', game.id);
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
			    var addrounds = 4;
			    for(var i=1;i<addrounds; i++){
		
					if(i < 2){
			            console.log('in l1 ' + i);
			            n = {
			            	'number': i,
							'level_one': true,
							'url': gUrl + i,
							'complete': false
						};
						r.push(n);
					} else if (i < 3){
			            console.log('in l2 ' + i);
			            n = {
			            	'number': i,
							'level_two': true,
							'url': gUrl + i,
							'complete': false
						};
						r.push(n);
					} else {
				        console.log('in l3 '+ i);
				        n = {
				        	'number': i,
							'level_three': true,
							'url': gUrl + i,
							'complete': false
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

		changeActive: function(model){
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
			var gp = this.attributes.players,
				that = this;
			var w_c = this.attributes.word_countdown,
				rIndex = info.level - 1,
				roundx = this.attributes.round[rIndex];

			if(info.ng_request != '' && info.ng_request != undefined){
			//new game is requested
				return{
					ng_request: info.ng_request,
					complete:true
				}
			} else {
				if(w_c > 1){
					var wc = w_c - 1,
						stage = 'in_progress',
						rev = false, 
						ip = true,
						rturn = this.attributes.round_turn,
						wturn = this.rotateTurn({round_turn: false}),
						z;
					//On first save, save the card info, all other times refer back to round card.
					if(wc == 9){
						if(info.word != undefined && info.word != ''){
							var story = info.word;
						} else {
							var story = '';
						}
						if (round_cards != undefined){
							var rd = info.level;
							function cid(element, index, array){
							    console.log(element);
							    if(rd == element.round){
								    z = element.card;
							    }
							};
							round_cards.forEach(cid);
						}
					}else {
						//Not first save, add the word to the story and save existing card.
						//make sure a word was entered.
						if(info.word != undefined && info.word != ''){
							var story = this.attributes.round[rIndex].story + ' ' + info.word;
						} else {
							var story = this.attributes.round[rIndex].story;
						}
						z = this.attributes.round[rIndex].card;
					}

				} else if(w_c == 1) {  
					//word_countdown will now be 0
					// Setup for roundReview
					var wc = w_c - 1,
						rev = true,
						rturn = this.rotateTurn({round_turn: true}),
						wturn = rturn,
						ip = true,
						stage = 'review';
					Object.defineProperty(roundx, "complete", {value : true,
		                               writable : true,
		                               enumerable : true,
		                               configurable : true});
					Object.defineProperty(roundx, "url", {value : roundx.url + '/complete',
		                               writable : true,
		                               enumerable : true,
		                               configurable : true});
				}else if(w_c == 0){
					if (info.close != undefined){//done with round review
						console.log('setting review to false, setting up new round');
						if(rIndex !== 2 && !this.attributes.round[rIndex + 1].in_progress){
							var wc = 10,
								story = this.attributes.round[rIndex].story,
								ip = false,
								rev = false,
								rturn = this.attributes.round_turn,
								wturn = this.attributes.round_turn;	
						} else {
							if(rIndex == 2){
								var stage = 'complete';
							}
							var wc = this.attributes.round[rIndex].word_countdown,
								story = this.attributes.round[rIndex].story,
								ip = this.attributes.round[rIndex].in_progress,
								rev = this.attributes.round[rIndex].review,
								rturn = this.attributes.round_turn,
								wturn = this.attributes.word_turn;
						}
					}
				}//end of w_c conditional
				console.log(z);
				Object.defineProperty(roundx, "card", {value : z,
	                               writable : true,
	                               enumerable : true,
	                               configurable : true});

				Object.defineProperty(roundx, "story", {value : story,
	                               writable : true,
	                               enumerable : true,
	                               configurable : true});
				Object.defineProperty(roundx, "in_progress", {value : ip,
	                               writable : true,
	                               enumerable : true,
	                               configurable : true});
				Object.defineProperty(roundx, "review", {value : rev,
		                               writable : true,
		                               enumerable : true,
		                               configurable : true});

				console.log(roundx);
				console.log('word_countdown is ' + wc);
				return{
					word_countdown: wc,
					word_turn: wturn,
					round_turn: rturn
				}
				function setStage(element, index, array){
						console.log('inside setStage');
						if(stage == 'in_progress'){
							if(element.fb_id == currentUser){
								console.log('closed this round, setting stage in_progress for next round on ' + element.name);
								var player = that.attributes.players[index];
								Object.defineProperty(player, "stage", {value : stage,
			                               writable : true,
			                               enumerable : true,
			                               configurable : true});
							}
						} else {
							var player = that.attributes.players[index];
							Object.defineProperty(player, "stage", {value : stage,
				                           writable : true,
				                           enumerable : true,
				                           configurable : true});
						}
						
				};
				gp.forEach(setStage);
			}
		},

		saveData: function(info){
			console.log(info);
			this.y = info.playerId;
			this.x = info.room;
			var that = this;
			this.save(this.setData(info),{
				success: function(game){
					if (info.close){
						if(game.attributes.round_turn == name || game.attributes.round[2].complete || game.attributes.players.stage == 'review'){
							app.AppView.vent.trigger('playGame', game);
						} else {
							app.AppView.vent.trigger('home');
						}
					} else {
						if(game.attributes.round[info.level - 1].complete == true){
							app.AppView.vent.trigger('playGame', game);
						} else {
							app.AppView.vent.trigger('home');
						}
					}
					
					var gp = game.attributes.players;
					function update(element, index, array){
						var rIndex = info.level - 1;
						var playerID = element.fb_id;
						console.log(that.y);
					    app.AppView.vent.trigger('updateP', playerID, game, rIndex);
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