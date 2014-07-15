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
            _.bindAll(this, 'updateTurn', 'turn', 'removeGame' ,'login', 'renderPlayer', 'setGameData','gameArray');
			console.log('The playerModel has been initialized.');
            this.room = this.id;
            var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
            socket.emit('room', {room: this.room});
		},

        updateTurn: function(game, p){ 
            var game = game;
            var p = p;
            console.log(game);
            console.log(p);
            var that = this;
            if(p != undefined){
                this.save(this.turn(game, p),{
                    success: function(player){
                        console.log('successfully updated player: ');
                        console.log(player);
                        app.AppView.vent.trigger('updateHv');
                    }
                });
            }
            
        },

        turn: function(game, p){
            var game = game;
            var p = p;
            console.log(game);
            console.log(p);
            var k = {};//k represents the game _id inside the players game object
            var gid = game.id;
            var i = this.attributes.games;
            function getId( element, index, array ){       
                 if (element.id == gid){ 
                      k = element;  
                 }
            };
            i.forEach(getId);
            var obje = {};
            console.log(game.attributes.players[p].stage);
            if(game.attributes.players[p].stage != 'in_progress'){
                obje = Object.defineProperty(k, "turn", {value: this.attributes.name,
                    writable : true,
                   enumerable : true,
                   configurable : true
                });
                console.log('setting turn to ' +  this.attributes.name + ' with this object');
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

        updateGame: function(a, b, c){
                var game = a;
                var player = b;
                var stage = c;
                var gid = game.id,
                    i = player.attributes.games,
                    k = {};
                console.log(i);
                console.log(game);
                function getGame( element, index, array ){       
                     if (element.id == gid){ 
                          k = element;  
                     }
                };
                i.forEach(getGame);
                Object.defineProperty(k, "stage", {value: stage,
                        writable : true,
                        enumerable : true,
                        configurable : true
                });
        },

        removeGame: function(gameModel, player, stage){
            console.log(gameModel);
            console.log(player);
            console.log(stage);
            var k;
            function getModel( element, index, array ){       
                 if (element.id == gid){ 
                      k = element;  
                 }
            };
            function createIdArray(array){
                var list = [];
                function getId(element, index, array){
                    var p = element._id;
                    list.push(p);
                };
                array.forEach(getId);
                return list;
            };
            if(stage != undefined && stage != ''){
                console.log('Changing only stage with ' + stage);
                player.save(this.updateGame(gameModel, player, stage),{
                    success: function(player){
                        app.AppView.vent.trigger('home', player);
                    }
                });
            } else {
                var gid = gameModel.id;
                console.log('game id sent to be removed is ' + gid);
                var g = player.attributes.games;
                console.log(g);
                g.forEach(getModel);
                var pgid = k._id;
                console.log('The game id (PGID) to remove is ' + pgid);
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
                            that.renderPlayer(player);
                        }
                    });
                }
            }            
        },


		login: function(){
			console.log('playerModel has triggered login function.');
			this.set({loggedin: true});
			this.collection.loginPlayer(this);
		},

		renderPlayer: function(player){
            app.AppRouter.navigate('#/players/' + player.id);
            //app.AppView.vent.trigger('loggedin', player);
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
            var gp = game.attributes.players;
            var m;
            function k (){
                for(var i =0;i<=gp.length;i++){
                    console.log(gp[i]);
                    m = gp[i];
                    if(gp[i].controller == true){
                        break; 
                    }
                }
            };
            k();
            var t;

            if(m.name == name){
                t = true;
            } else {
                t = false;
            }
            console.log('Controller is ' + m.name + ' I\'m ' + name + ' t is ' + t);
            var x = {
                id: game.id, 
                players: game.attributes.players,
                url: String('#/players/' + player.id + '/games/' + game.id),
                turn: game.attributes.word_turn,
                controller: t
            };


        	var games = player.attributes.games;
        	console.log('gameArray found ' + games.length + ' game(s).');
        	games.push(x);
        }

    });


})();