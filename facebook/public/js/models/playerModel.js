var app = app || {};

(function () {
        'use strict';

	app.playerModel = Backbone.Model.extend({
	    urlRoot: '/facebook/players',
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
            _.bindAll(this, 'updateTurn', 'turn','updatePlayer', 'removeGame' ,'login', 'renderPlayer', 'setGameData','gameArray');
			console.log('The playerModel has been initialized.');
            app.AppView.vent.on('modelRemove', this.removeGame, this);
            app.AppView.vent.once('updatePlayer', this.updatePlayer, this);
            app.AppView.vent.on('updateTurn', this.updateTurn, this);

		},

        updateTurn: function(player, game, round){ 
            console.log('updateTurn called on PlayersModel');
            console.log(player);
            console.log(game);
            player.save(this.turn(player, game, round),{
                success: function(){
                    console.log('successfully updated player: ');
                    console.log(player);
                    app.AppView.vent.trigger('updatehv');
                }
            });
        },

        turn: function(player, game, round){
            var k = {};//k represents the game _id inside the players game object
            var gid = game.id;
            var i = player.attributes.games;
            function getId( element, index, array ){       
                 if (element.id == gid){ 
                      k = element;  
                 }
            };
            i.forEach(getId);
            var obje = {};
            if(game.attributes.round[round].complete){
                obje = Object.defineProperty(k, "turn", {value:name,
                    writable : true,
                   enumerable : true,
                   configurable : true
                });
                console.log('setting turn to ' +  name + ' with this object');
            } else {
                obje = Object.defineProperty(k, "turn", {value:game.attributes.word_turn,
                    writable : true,
                   enumerable : true,
                   configurable : true
                });
                console.log('setting turn to ' +  game.attributes.word_turn + ' with this object');
            }
            console.log(obje);
        },

        updatePlayer: function(player, points){
            /*player.save({
                points: total
            }, {
                success: function(player){
                    console.log('successfully saved '+ player.attributes.name +'\'s new points: ' + player.attributes.points);
                }
            });
            //this.renderPlayer(model);*/
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

        setGameData: function(game, player){
        	var model = player;
        	console.log('Displaying the player model: '); 
        	console.log(model);
            console.log('and the game info inside setGameData');
            console.log(game);
        	model.save(this.gameArray(game, model), {
        		success: function(model){
		        	console.log('Saving game id ' + model.attributes.games.id + ' to the player ' + model.id);
        		}
        	});       	
        },

        gameArray: function(game, player){
        	var x = {
                id: game.id, 
                players: game.attributes.players,
                url: String('#/players/' + player.id + '/games/' + game.id),
                turn: game.attributes.word_turn,
                };
        	var games = player.attributes.games;
        	console.log('gameArray found ' + games.length + ' game(s).');
        	games.push(x);
        }

    });


})();