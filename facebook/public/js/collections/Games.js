var app = app || {};

(function () {
        'use strict';

	app.Games = Backbone.Collection.extend({
		model: app.gameModel,
		
		initialize: function(options){
			console.log('Game Collection initialized with options id: ');
			console.log(options);
			this.listenTo(this, 'add', this.triggerURL);
			if (options !== undefined){
				if(options.p1url = player.id){
					this.y = options.p1url;
				}
			} else {
				this.y = undefined;
			}
		},

		renderGame: function(){
			app.AppRouter.navigate('/players/' + this.y + '/games', true);
			//this.trigger('gameStarted');
		},

//		url: '/players/games',
		
		triggerURL: function(options){
			if (options !== undefined){
				this.y = options.p1url;
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

		//getlist: function(p1){
		//	var allgames = this.where({p1url: p1});
		//	console.log(allgames);
		//}

		
	});

})();