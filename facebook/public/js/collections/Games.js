var app = app || {};

(function () {

	app.Games = Backbone.Collection.extend({

		model: app.gameModel,
		
		initialize: function(options){
			console.log('Game Collection initialized with options id: ');
			console.log(options);
		    _.bindAll(this, 'rotateModel','checkGames','setGameData','createGame','renderGame', 'triggerURL', 'url');
		    app.AppView.vent.on('checkForGames', this.checkGames, this);
		    app.AppView.vent.on('startTimer', this.rotateModel, this);
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

		setGameData: function(info){
			return{
				player1: Number(currentUser),
				player1_name: name,
				player2: info.player2to,
				player2_name: info.p2name,
				complete: false,
				active: true,
				turn: Number(currentUser),
				p1url: info.p1url,
				p2url: info.p2url
			};
		},

		createGame: function(info){
			console.log('Games collection on createGame with ');
			console.log(info);
		    this.create(this.setGameData(info),
		    	{
	    			success: function(game, info){
	    				console.log('Successfully saved game data for id: ' + game.id);
	    				app.AppView.vent.trigger('gameSaved', game, info.p1url, info.p2url);   				
	    			}
	    		}
    		);
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