var app = app || {};

(function () {
        'use strict';

	app.gameModel = Backbone.Model.extend({
		//urlRoot: '/players',
		defaults: {
			game_id: "",
			p1url: "",
			sentence: "",
			complete: "",
			active: "",
			turn: "",
			player1: "",
			player2: ""
		},

		idAttribute: '_id',
		
		initialize: function(options){
			console.log('gameModel initialized with options id: ');
			console.log(options.p1url);
			if (options !== undefined){
				this.y = options.p1url;
				app.AppRouter.navigate('/players/' + this.y + '/games');
			} else {
				this.y = undefined;
			}			
		},

		url: function(){
			if (this.y !== undefined){
				return '/players/' + this.y + '/games';
			} else {
				return '/players/' + 'x' + '/games';
			}
			
		},

		renderGame: function(game){
			app.AppRouter.navigate('/players/' + game.p1url + '/games');
			//this.trigger('gameStarted');
		}


	});

})();