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
            app.AppView.vent.on('modelRemove', this.removeGame, this);
            this.room = this.id;
            var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
            socket.emit('room', {room: this.room});
		},

        updateTurn: function(game, round){ 
            var game = game;
            var round = round;
            console.log(game);
            console.log(round);
            var that = this;
            if(round != undefined){
                this.save(this.turn(game, round),{
                    success: function(player){
                        console.log('successfully updated player: ');
                        console.log(player);
                        app.AppView.vent.trigger('updateHv');
                    }
                });
            }
            
        },

        turn: function(game, round){
            var game = game;
            var round = round;
            console.log(game);
            console.log(round);
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
            console.log(game.attributes.round[round]);
            if(game.attributes.round[round].review){
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

        removeGame: function(gameModel, player){
            var gid = gameModel.id;
            console.log('game id sent to be removed is ' + gid);
            var g = player.attributes.games;
            console.log(g);

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