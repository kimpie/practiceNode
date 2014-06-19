var app = app || {};

(function () {

	app.Games = Backbone.Collection.extend({

		model: app.gameModel,
		
		initialize: function(options){
			//console.log('Game Collection initialized with options id: ');
			//console.log(options);
		    _.bindAll(this, 'rotateModel','checkGames','setGameData','createGame','renderGame', 'triggerURL', 'url');
		    app.AppView.vent.on('checkForGames', this.checkGames, this);
		    app.AppView.vent.on('startTimer', this.rotateModel, this);
		    //app.AppView.vent.on('roundInfo', this.getGame, this);
		    //app.AppView.vent.on('requestNewGame', this.rng, this);
			this.listenTo(this, 'add', this.triggerURL);
			
			if (options !== undefined){
				if(options.p1url == player.id){
					this.y = options.p1url;
				} else if (options.p2url == player.id){
					this.y = options.p2url;
				}
			} else {
					this.y = undefined;
			}

		},

		getGame: function(game, path){
			console.log('getGame in Games Collection has game ' + game + ' and path ' + path);
			var model = this.findWhere({_id: game});
			model.getRound(path);
		},

		rng: function(p2name, player, gid){
			var oldGame = this.findWhere({_id: gid});
			console.log('oldGame is ');
			console.log(oldGame);

			var o = String(oldGame.attributes.player1);
			var p = String(oldGame.attributes.player2);
			var q = o + p;
			var room = q;
			//send a request to p2name asking to start a new game with this player. 
			if (oldGame.attributes.player2_name == p2name){
				console.log('sending request to player2');
				//tell gamesView to notify this player of new request
				socket.emit('newGameRequest', {
					playerRequesting: Number(oldGame.attributes.player2),
					playerRequested: Number(oldGame.attributes.player1)
				});
			} else {
				console.log('sending request to player1');
				socket.emit('newGameRequest', {
					playerRequesting: Number(oldGame.attributes.player2),
					playerRequested: Number(oldGame.attributes.player1)
				});
			}


		},

		rotateModel: function(){
			var gid = this.where({complete:true, share: true, active: false});
			var that = this;
			function grabmodel(collection){
				var model = that.get(collection[Math.floor(Math.random() * collection.length)]);
				return model;
			};	
			
			var i = window.setInterval( 
				function(){
				//set rotatemodel to a new model
				var model = grabmodel(gid);
				app.AppView.vent.trigger('rotate', model);
            }, 30000 );

		},

		checkGames: function(player, pcGames){

			//Find all active games on the Game Collection for the currentUser.
			var gc1 = this.where({    
				player1: Number(currentUser),    
				active: true    
				})
			var gc2 = this.where({
				player2: Number(currentUser),    
				active:true    
				});
			var gcGames = [];
			var gcGames = gcGames.concat(gc1, gc2);
			console.log(gcGames);
			//pcGames represent all the games saved to the Player Model.
			var pcGames = pcGames;
			

			//Defining functions needed for code below....

			//fn to pull out the id's from the pcGames and gcGames arrays.
			function eliminateDuplicates(arr) {
			 
			    var list = [];
			    function getId(element, index, arr){
				var k = element.id;
				list.push(k);
			    };
			    arr.forEach(getId);
				console.log(list);
				 var i,
				      len=list.length,
				      out=[],
				      obj={};
				  for (i=0;i<len;i++) {
				    obj[list[i]]=0;
				  }
				  for (i in obj) {
				    out.push(i);
				  }
			  	console.log(out);
				return out;
			};


			/*function createIdArray(array){
				var list = [];
				console.log('list under createIdArray');
				console.log(list);
			    function getId(element, index, array){
			        var k = element.id;
			        list.push(k);
			    };

			    var x = list;
				array.forEach(getId);
			    return x;
			};*/
			//PCID & GCID are arrays of game id's only.
			//var gcid = createIdArray(gcGames);
			var gcid = eliminateDuplicates(gcGames);
			//console.log(gcid);
			//var gcid = gcid.toString();
			//var gcid = gcid.split(",");
			console.log('gcid');
			console.log(gcid);

			var pcid = eliminateDuplicates(pcGames);
			console.log('pcid');
			console.log(pcid);


			//Compare to see if array lengths are equal
			if (gcid.length == pcid.length){
				console.log('gcGames & pcGames match up')
			} else {
			//Go through the collections and pull out the id that is missing
			var match = [];
			var tbr = [];

			function compare(array1, array2){

			    function findMatch(element, index, array){
			       var k = element;
			       for(var i=0;i<array1.length; i++){
			            if (k == array2[i]){
			                console.log(k + ' equal to ' + array2[i]);
			                match.push(array2[i]);
			                var index = array1.indexOf(array2[i]);
			                tbr.push(index);
			            }
			        }; 
			    };
			    
			    function findMissing(element, index, array){
			        console.log('tbr is' + tbr);
			        var t = element;
			            array1.splice(t, 1);
			        //};
			    };
			    
			    array1.forEach(findMatch);
			    console.log('showing matches');
			    console.log(match);
			    tbr.sort(function(a,b){return b - a});
			    tbr.forEach(findMissing);
			    
			    return array1;
			};

		
/*			//Compare to see if array lengths are equal
			if (gcid.length == pcid.length){
				console.log('gcGames & pcGames match up')
			} else {
*/
			//Not equal so find out which one is longer to know which is missing the games.
				function findB(a,b){    
				    var x = Math.max(a.length,b.length);    
				    if (x == a){        
				        return a;    
				    } else {        
				        return b;   
				    }    
				};
				//Count represents the collcetion that is not missing the id.
				var count = findB(pcid,gcid);
				//Return which collection is missing the games and set arrays for compare fn.
				var mc = Object.is(count.length, pcid.length);
				if (mc){
					var mgc = "gcGames";
					var array2 = gcid;
					var array1 = pcid;
				} else {
					var mgc = "pcGames";
					var array2 = pcid;
					var array1 = gcid;
				}
				console.log('The array missing a game is ' + mgc);
				//Returns the missing id's that aren't in the mgc(missing game collection).
				//array1 will always be the array with more elements, array2 will always be 
				//less and is therefore the collection missing an id.
				var mid = compare(array1, array2);
			}				
			

			console.log('checkGames player id is ' + player.id);

			if (mid != undefined && mid.length != 0){	
				console.log('The missing id(s): ' + mid);
				var that = this;
				if (mid.length > 1){
				  	var  allg = mid;
				    function findp2(i){
				      var game = that.findWhere({_id: i});
				      console.log('Found game in checkForGames findp2 fn:')
				      console.log(game);
				      //if (Number(currentUser) == game.attributes.player1){
  					  //    var found = game.attributes.p1url;
				      //} else if (Number(currentUser) == game.attributes.player2){
  					  //    var found = game.attributes.p2url;
				      //}

					     // if (found == ""){
					      	//Tell the Players Collection to save the game information to the player model
							app.AppView.vent.trigger('gameSaved updateGameInfo', game, player.id);
							//Tell the game to save the player id to the game model
							//app.AppView.vent.trigger('updateGameInfo', games, player.id);
					     // } else {
					     // 	app.AppView.vent.trigger('gameSaved', game, player.id);
					     // 	console.log('Games Collection checkGames fn says game info is up to date');
					     // }
				    };  				
				    
				    for (var i = 0; i < allg.length; i++){
				  		findp2(mid[i]);
				    };
				} else {
					var game = that.findWhere({_id: mid[0]});
						//Tell the Players Collection  & Game Collection to save the game information
						app.AppView.vent.trigger('gameSaved updateGameInfo', game, player.id);

				} 
			} else {
				console.log('All games up to date for ' + Number(currentUser));
			}

		},

		setGameData: function(info, response){
			console.log('all info coming in from createGame');
			console.log(info);
			console.log(response);
			var modelPlayers = [];
			var to = response.to;
			var place = info[1];
			function setPlayerData(data){
				console.log('iterating through setPlayerData on ' + data.name);
				var x = data.name,
				    y = data.id;
				    playerInfo = {
				        'name': x, 
				        'fb_id': y,
				        'points': 0
				    }; 
				    modelPlayers.push(playerInfo);
			};
			for ( var i = 0; i < to.length; i++){
			    FB.api(to[i], function (data){
					setPlayerData(data);
				});
				console.log('mp from inside for loop');
				console.log(modelPlayers);
			};
			console.log('modelPlayers outside');
			console.log(modelPlayers);
				if (modelPlayers.length > 0){
					console.log('modelPlayers length ' + modelPlayers.length)
					return{
						complete: false,
						active: true,
						turn: '',
						place: place,
						players: modelPlayers
					};
				} else {
					console.log('modelPlayers is empty');
				}
		},

		check: function(friend, info){
			console.log('going through check inside Games collection');
			var to = friend
			var info = info;
			var match = {};
			//function findMatch(to){
				var t = this.findWhere({player1: Number(to), player2: Number(currentUser), active: true});
				var s = this.findWhere({player1: Number(currentUser), player2: Number(to), active: true}); 
				if (t){
					var match = t;
					var active = true;
				} else if (s) {
					var match = s;
					var active = true;
				} else {
					var match = undefined;
					var active = false;
				}
				console.log('ifActive inside check is ' + active);
				return active;
			//};
		},//End of checkGame fn() 

		startGameProcess: function(response, info){
			console.log('startGameProcess with info:');
			var response = response;
			var info = info;
			console.log(response);
			console.log(info);
			var people = info[1];
			var that = this;
  			//if (response.to.length > 1){ //If more than one friend requested
  				if (people == "One-on-One"){ //If more than one friend req and games are one-on-one
					console.log('games are one one one');
					var friends = response.to;
	  				for (var i = 0; i < friends.length; i++){
	  					var ifActive = that.check(friends[i], info);	
	  					console.log('ifActive in startGameProcess is ' + ifActive);
						if (ifActive) {
							console.log('This game already exists.');
							app.AppRouter.navigate('/players/' + x + '/games/' + match.attributes.id, true);
						} else {
							that.createGame(response, info);
						}
	  				}	
  				} else if (people == "Group"){  //If more than one friend req but game is for group
					console.log('more than one friend requested for the group game');
					//logic needed: FB.api needs to loop through the list and assignGameData for each
					//	Don't need to check if any games already exist with these people
					//GameInfo will be a little different
					that.createGame(response, info);
  				} /// end of if/else if people		  				
  			//} else {
  			//	console.log('one friend requested, game will be one-on-one');
  			//	that.createGame(response, info);
  			//}//End of response.to length if/else 
		},

		createGame: function(response, info){
			var to = response.to,
				info = info,
				place = info[0],
				that = this;
			var modelPlayers = [{
				'name': name,
				'fb_id' : Number(currentUser),
				'points' : Number('0'),
				'controller' : true
			}];
			function setData(data){
				var playerInfo = {
					'name': data.name,
					'fb_id' : Number(data.id),
					'points': Number('0')
				};
				modelPlayers.push(playerInfo);
				console.log(modelPlayers);
				if (modelPlayers.length == (to.length + 1) ){
					that.create({
						'place': place,
				    	'round_turn': modelPlayers[0].name,
				    	'word_turn': modelPlayers[0].name,
				    	'complete': false,
				    	'active' : true,
				    	'word_countdown' : 10,
				    	'players' : modelPlayers
					},{
						success: function (game){
					    		console.log(game);
					    		app.AppView.vent.trigger('playGame', game.id);
					    		app.AppView.vent.trigger('gameSaved', game);
					    	}
					})
				}
			};
			for ( var i = 0; i < to.length; i++){
		    	console.log('iterating through ' + to[i]);
			    FB.api(to[i], function (data){
			    	setData(data);
				});
			};
		},

		renderGame: function(){
			app.AppRouter.navigate('/players/' + this.y + '/games', true);
		},

		triggerURL: function(options){
			if (options !== undefined){
				this.y = options.p1url;
			} else {
				this.y = undefined;
			}	
		},

		url: function(){
			if (this.y !== undefined){
				return '/facebook/players/' + this.y + '/games';
			} else {
				return '/facebook/players/' + 'x' + '/games';
			}
		}
		
	});

})();