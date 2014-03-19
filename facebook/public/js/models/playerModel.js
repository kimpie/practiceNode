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
      		games: []
			},

		idAttribute: '_id',

		initialize: function(){
            _.bindAll(this, 'login', 'renderPlayer', 'setGameData', 'setGameData2', 'gameArray', 'gameArray2');
			console.log('The playerModel has been initialized.');

		},


		login: function(){
			console.log('playerModel has triggered login function.');
			this.set({loggedin: true});
			this.collection.loginPlayer(this);
		},

		renderPlayer: function(player){
            app.AppRouter.navigate('/players/' + player.id, true);
        },

        setGameData: function(game, player, player2model){
        	var thismodel = player;
        	console.log('Displaying the current player model: '); 
        	console.log(thismodel);
        	thismodel.save(this.gameArray(game, player), {
        		success: function(game, player){
		        	console.log('Saving game id ' + game.id + ' to the player ' + player.id);
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
                url: String('#/players/' + player.id + '/games/' + game.id)
                };
        	var games = player.attributes.games;
        	console.log('gameArray found ' + games.length + ' game(s).');
        	games.push(x);
        },

        gameArray2: function(game, player2model){
        	var x = {
                id: game.id, 
                player2_name: game.attributes.player1_name,
                url: String('#/players/' + player2model.id + '/games/' + game.id)
                };
        	var games2 = player2model.attributes.games;
        	games2.push(x);
        }

    });


})();