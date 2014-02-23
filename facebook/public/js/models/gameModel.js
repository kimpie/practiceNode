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
			//this.collection = new app.Games();
			//this.listenTo(this.collection, 'add', this.triggerURL);	
			if (options !== undefined){
				this.y = options.p1url;
			} else {
				this.y = undefined;
			}		
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
				return 'players/' + this.y + '/games';
			} else {
				return 'players/' + 'x' + '/games';
			}
			
		},

		renderGame: function(){
			app.AppRouter.navigate('players/' + this.y + '/games', true);
			//this.trigger('gameStarted');
		}


	});

})();