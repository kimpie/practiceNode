var app = app || {};

(function () {
        'use strict';

	app.Games = Backbone.Collection.extend({

		model: app.gameModel,
		
		initialize: function(options){
			console.log('Game Collection initialized with options id: ');
			console.log(options);
		    _.bindAll(this, 'renderGame', 'triggerURL', 'url', 'createGame');

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

		createGame: function(){
		    var exists = this.get(data.id);
		    if (!exists) {
		      this.add(data);
		    } else {
		      data.fromServer = true;
		      exists.set(data);
		    }
		},

		renderGame: function(){
			app.AppRouter.navigate('/players/' + this.y + '/games', true);
			//this.trigger('gameStarted');
		},

/*		sendSocket: function(game){
			var o = String(game.attributes.player1);
			var p = String(game.attributes.player2);
			var q = o + p;
			socket.emit('addGame', {
				room: q,
				p1: Number(o),
				p2: Number(p)
			});
		},
*/
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