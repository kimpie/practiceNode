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
			console.log(model);
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
			var that = this,
				rIndex = Number(info.level) - 1,
				roundx = this.attributes.round[rIndex],
				gp = this.attributes.players, w_c, itsMe;
			function findMe(element,index,array){
				if(element.name == name){
					itsMe = element;
				}
			};
			gp.forEach(findMe);
			console.log(info.word_countdown);
			if(info.word_countdown != undefined){
				w_c = info.word_countdown;
				console.log('inside if, w_c is '+ w_c);
			} else { 
				w_c = this.attributes.word_countdown;
				console.log('inside else, w_c is '+ w_c);
			}
			var wc, story, ip, rev, rturn, z, stage, wturn;
			function attrConstant(){
				console.log('nothingChanges fn, all attr stay same');
				wc = that.attributes.word_countdown,
				story = that.attributes.round[rIndex].story,
				ip = that.attributes.round[rIndex].in_progress,
				rev = that.attributes.round[rIndex].review,
				rturn = that.attributes.round_turn,
				z = that.attributes.round[rIndex].card,
				wturn = that.attributes.word_turn;
			};
			function setupReview(){
				console.log('inside setupReview');
				rev = true,
				rturn = that.rotateTurn({round_turn: true}),
				wturn = rturn,
				ip = false,
				stage = 'review';
				Object.defineProperty(roundx, "complete", {value : true,
	                               writable : true,
	                               enumerable : true,
	                               configurable : true});
				Object.defineProperty(roundx, "url", {value : roundx.url + '/complete',
	                               writable : true,
	                               enumerable : true,
	                               configurable : true});
			};
			function setupNew(){
				console.log('inside setupNew');
				wc = 10,
				story = that.attributes.round[rIndex].story,
				ip = false,
				rev = false,
				rturn = that.attributes.round_turn,
				z = that.attributes.round[rIndex].card,
				wturn = that.attributes.round_turn,
				stage = 'in_progress';	
			};
			function callRemove(element, index, array){
				var stage = undefined;
				var p = element.fb_id;
				app.AppView.vent.trigger('removeGame', that, p, stage);
			};
			if(info.stage == 'removed'){
				stage = 'removed';
				wc =''; rturn =''; wturn ='';
				var gp = that.attributes.players;	
				var k;
				function removeAll(element, index, array){
					if(element.name != name && element.stage != 'removed'){
						k  = true;
					}
				};
				gp.forEach(removeAll);
				if(k){
				  console.log('not ready to remove from all');
				} else {
				  console.log('ready to remove all');
				  that.changeActive(that);
				  gp.forEach(callRemove);
				}
			} else {
				console.log('game is ' + this.attributes.place);
				if (this.attributes.place == 'Live'){
					console.log('game is live');
					if(info.close){
						if(rIndex == 2){
							stage = 'complete';
						} else {
							setupNew();
							console.log(wc);
						}

					}else {
						var wc = 0,
							story = info.word;
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
						setupReview();
					}
				} else {
					console.log('game is online and w_c is ' + w_c);
					var that = this;
					if(w_c > 1){
						if(this.attributes.gt == 'strategy'){
							if(this.attributes.gt_story == undefined){
								var gts = info.word;
							} else if(this.attributes.gt_story != undefined){
								var gts = that.attributes.gt_story + ' ' + info.word;
							}
							var wc = w_c -1,
								sw = info.sWord,
								gt_story = gts,
								wturn = this.rotateTurn({round_turn: false}),
								stage = 'in_progress';
						} else {
							console.log('w_c > 1');
							var pStage = this.checkStage();
							console.log('player stage is ' + pStage);
							if(pStage == 'review'){
								console.log('calling attrConstant fn');
								//new round has started and player is now joinging it
								var stage = 'in_progress';
								attrConstant();
							} else {
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
							}
						}

					} else if(w_c == 1) {  
						console.log('w_c == 1');
						if(this.attributes.gt == 'strategy'){
							if(this.attributes.gt_story == undefined){
								var gts = info.word;
							} else if(this.attributes.gt_story != undefined){
								var gts = that.attributes.gt_story + ' ' + info.word;
							}
							var wc = w_c -1,
								gt_story = gts,
								wturn = this.rotateTurn({round_turn: false}),
								sw = info.sWord,
								stage = 'review';
						} else {
							//word_countdown will now be 0; Setup for roundReview
							var wc = w_c - 1;
							setupReview();
							z = that.attributes.round[rIndex].card;
							if(info.word != undefined && info.word != ''){
								var story = this.attributes.round[rIndex].story + ' ' + info.word;
							} else {
								var story = this.attributes.round[rIndex].story;
							}
						}

					}else if(w_c == 0){
						console.log('w_c == 0');
						if (info.close != undefined){//done with round review
							if(this.attributes.gt == 'strategy'){
							if(this.attributes.gt_story == undefined){
								var gts = info.word;
							} else if(this.attributes.gt_story != undefined){
								var gts = that.attributes.gt_story + ' ' + info.word;
							}
								var wc = w_c -1,
									gt_story = gts,
									sw = info.sWord,
									wturn = this.rotateTurn({round_turn: false}),
									stage = 'complete';
							} else {
								if(rIndex !== 2 && !this.attributes.round[rIndex + 1].in_progress && this.attributes.round_turn == name){
									console.log('setting review to false, setting up new round');
									setupNew();
								} else {
									console.log(rIndex);
									if(rIndex == 2){
										var stage = 'complete';
									} else {
										console.log('keeping everything the same, setting stage to in_progress');
										var stage = 'in_progress';
										attrConstant();
									}
								}
							}
						}
					}//end of w_c conditional
				}
				console.log(z);
				if(typeof roundx == 'object'){
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
				}

				if(info.sWord){
					Object.defineProperty(itsMe, "sWord", {value : sw,
                       writable : true,
                       enumerable : true,
                       configurable : true});
				}
				console.log(roundx);
				console.log('word_countdown is ' + wc);
			}
			function setStage(element, index, array){
				console.log('inside setStage');
				if(stage == 'in_progress' || stage == 'removed'){
					if(element.fb_id == currentUser){
						console.log('setting stage in_progress for ' + element.name);
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
			console.log('should setStage now with ' + stage);
			gp.forEach(setStage);
			return{
				word_countdown: wc,
				word_turn: wturn,
				round_turn: rturn,
				gt_story: gt_story
			}
		},

		saveData: function(info){
			console.log(info);
			this.y = info.playerId;
			this.x = info.room;
			var that = this;
			console.log(location.hash.split('/')[2]);
			console.log(this.y == location.hash.split('/')[2]);
			if(this.y == location.hash.split('/')[2]){
				this.save(this.setData(info),{
					success: function(game){
						var gp = game.attributes.players;
						var i, c, remove, m, review;
						function findMe(element, index, array){
							if(element.name == name){
								i = index;
								m = element.fb_id;
								if(element.stage == 'removed'){
									remove = true;
								} else { remove = false;}
								if(element.stage == 'review' || element.stage == 'complete'){
									review = true;
								} else {review=false;}
							}		
						};
						gp.forEach(findMe);
						if(m == currentUser){
							if( !review || remove || (game.attributes.place == 'Online' && game.attributes.word_turn != name) || !(game.attributes.word_countdown == 10 && game.attributes.round_turn == name) || game.attributes.word_countdown != 0){
								console.log('gameModel trigger home for ' + name);
								app.AppView.vent.trigger('home');
							} else {
								console.log('gameModel trigger playGame for ' + name);
								app.AppView.vent.trigger('playGame', game);
							}	
						}
						function update(element, index, array){
							var pIndex = index;
							var playerID = element.fb_id;
							var info = {
								playerID: playerID,
								pIndex: pIndex,
								game: game, 
								points: element.points
							};
						    app.AppView.vent.trigger('updateP', info);
						};
						gp.forEach(update);
					}

				});
			}

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