var app = app || {};

(function () {
        'use strict';

	app.playerModel = Backbone.Model.extend({
		//urlRoot: '/facebook/players',
		defaults: {
			fb_id: "",
			first_name: "",
			last_name: "",
			name: "",
			gender: "",
			city: "",
			url: "",
			total_games: "",
      		last_login: "",
            points: "",
      		games: []
			},

		idAttribute: '_id',

		initialize: function(){
            _.bindAll(this, 'updatePlayer', 'removeGame' ,'login', 'renderPlayer', 'setGameData', 'setGameData2', 'gameArray', 'gameArray2');
			console.log('The playerModel has been initialized.');
            app.AppView.vent.on('modelRemove', this.removeGame, this);
            app.AppView.vent.once('updatePlayer', this.updatePlayer, this);
            app.AppView.vent.on('updateTurn', this.updateTurn, this);

		},

        updateTurn: function(player, player2, game){ 
            console.log('updateTurn called on PlayersModel');
            var player1 = player;
            var player2 = player2;

            if (Number(game.attributes.turn) == Number(player1.attributes.fb_id)){
                console.log('its player1 turn');
                player1.save(this.turn(player1, game),{
                    success: function(){
                        console.log('successfully updated turn on player model ' + player1.id);
                    }
                });
                player2.save(this.noturn(player2, game),{
                    success: function(){
                        console.log('successfully updated noturn on player model ' + player2.id);
                    }
                });

            } else {
                console.log('its player2 turn');
                player2.save(this.turn(player2, game),{
                    success: function(){
                        console.log('successfully updated turn on player model ' + player2.id);
                    }
                    
                });
                player1.save(this.noturn(player1, game),{
                    success: function(){
                        console.log('successfully updated noturn on player model ' + player1.id);
                    }
                });
            }       
            
        },

        turn: function(player, game){
            var k = {};//k represents the game _id inside the players game object
            var gid = game.id;
            var i = player.attributes.games;
            function getId( element, index, array ){       
                 if (element.id == gid){ 
                      k = element;  
                 }
            };
            i.forEach(getId);

            var obje = Object.defineProperty(k, "turn", {value:true,
                                writable : true,
                               enumerable : true,
                               configurable : true
                           });
            console.log('setting turn to TRUE with this object');
            console.log(obje);
        },
        noturn: function(player, game){
            var k = {};//k represents the game _id inside the players game object
            var gid = game.id;
            var i = player.attributes.games;
            function getId( element, index, array ){       
                 if (element.id == gid){ 
                      k = element;  
                 }
            };
            i.forEach(getId);

            var obje = Object.defineProperty(k, "turn", {value:false,
                                writable : true,
                               enumerable : true,
                               configurable : true
                           });
            console.log('setting turn to FALSE with this object');
            console.log(obje);
        },

        updatePlayer: function(player, points){
            var total = Number(points) + Number(player.attributes.points);
            console.log('saving player ' + player.id + ' points totalling: ' + total);
            player.save({
                points: total
            }, {
                success: function(player){
                    console.log('successfully saved '+ player.attributes.name +'\'s new points: ' + player.attributes.points);
                }
            });
            //this.renderPlayer(model);
        },

        removeGame: function(gameModel, player){
            var gid = gameModel.id;
            console.log('game id sent to be removed is ' + gid);
            var g = player.attributes.games;
            console.log(g);

            //Return the id that the player model gave to the game, separate from the game model id saved with it.
            /*function findIndex(player, id){
                var g = player.attributes.games;
                var gid = id;
                function getId( element, index, array ){    
                    if (element.id == gid){ 
                        return true;    
                    }
                };
                var k = g.find(getId);
                return k._id;

            };*/
            var k = {};
            function getModel( element, index, array ){       
                 if (element.id == gid){ 
                      k = element;  
                 }
            };

            g.forEach(getModel);
            var pgid = k._id;
            console.log('The game id (PGID) to remove is ' + pgid);
            function createIdArray(array){
                    var list = [];
                    function getId(element, index, array){
                        var k = element._id;
                        list.push(k);
                    };
                    array.forEach(getId);
                    return list;
            };

            var p_id = createIdArray(player.attributes.games);
            var p2name = k.player2_name;
            console.log('The array to pull ids from is ' + p_id);
            //var pgid = findIndex(player, id);
            var index = p_id.indexOf(pgid);
            if (index >= 0){
                console.log('The index to pull the id from is ' + index);
                var remove = player.attributes.games.splice(index, 1);
                var activeGames = player.attributes.games;
                console.log('game removed was');
                console.log(remove);
                console.log('updated games for player ' + player.attributes.fb_id + ' are: ');
                console.log(activeGames);
                
                var that = this;
                player.save({
                    games: activeGames
                }, {
                    success: function(player){
                        console.log('Success on updating the players games');
                        app.AppView.vent.trigger('requestNewGame', p2name, player, gid)
                        that.renderPlayer(player);
                    }
                });
            }
            
        },


		login: function(){
			console.log('playerModel has triggered login function.');
			this.set({loggedin: true});
			this.collection.loginPlayer(this);
		},

		renderPlayer: function(player){
            app.AppRouter.navigate('/players/' + player.id, true);
            app.AppView.vent.trigger('loggedin', player);
        },

        setGameData: function(game, playermodel){
        	var thismodel = playermodel;
        	console.log('Displaying the current player model: '); 
        	console.log(thismodel);
        	thismodel.save(this.gameArray(game, playermodel), {
        		success: function(game, playermodel){
		        	console.log('Saving game id ' + game.id + ' to the player ' + playermodel.id);
        		}
        	});       	
        },

        setGameData2: function(game, player2model){
            var othermodel = player2model;
            othermodel.save(this.gameArray2(game, player2model), {
                success: function(game,player2model){
                    console.log('Saving game id ' + game.id + ' to the player2 ' + player2model.id);            
                }
            });
        
        },

        gameArray: function(game, player){
        	var x = {
                id: game.id, 
                player2_name: game.attributes.player2_name,
                url: String('#/players/' + player.id + '/games/' + game.id),
                turn: true
                };
        	var games = player.attributes.games;
        	console.log('gameArray found ' + games.length + ' game(s).');
        	games.push(x);
        },

        gameArray2: function(game, player2model){
        	var x = {
                id: game.id, 
                player2_name: game.attributes.player1_name,
                url: String('#/players/' + player2model.id + '/games/' + game.id),
                turn: false
                };
        	var games2 = player2model.attributes.games;
        	games2.push(x);
        }

    });


})();