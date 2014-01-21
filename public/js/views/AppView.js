var app = app || {};

(function ($) {
        'use strict';


	app.AppView = Backbone.View.extend({
		
		initialize: function  () {
			console.log('AppView is initialized.');
			this.collection  = new app.Players();
			this.collection.fetch({reset: true});
			this.render();

			this.listenToOnce(this.collection, 'add', this.showPlayer);
			this.listenTo(this.collection, 'reset', this.render);

			this.userName = this.$('#userName');	
		
	      	socket = io.connect('https://completethesentence.com/');
	      	//this.router = new app.AppRouter;
		},

		events: {
			"click #login": "loginPlayer"
		},

		showPlayer: function(player) {
			var playerView = new app.PlayersView({model: player});
			this.userName.append(playerView.render().el);

		},

		setPlayerData: function (){
		    var x = new Date();
		    var currentTimeZoneOffsetInHours = x.getTimezoneOffset() / 60;
			return {
				fb_id: currentUser,
				first_name: first_name,
				last_name: last_name,
				name: name,
				city: city,
				url: currentUser,
				gender: gender,
				last_login: x
			};
		},

		loginPlayer: function (){
			var router = app.AppRouter;
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
			//var id = currentUser.valueOf();
			if (player == undefined){
				console.log('New Player is about to be posted.');
				this.collection.create(this.setPlayerData(),
					{
			      	success: function (model) {
						router.navigate('players/' + player.id, {trigger: true});
						console.log('Creating new model with URL: ' + player.id);
				    }
				});	
			} else {
				console.log('Existing Player has logged in');
				this.collection.get(player);
				var playerView = new app.PlayersView({model: player});
				this.userName.append(playerView.render().el);
				router.navigate('players/' + player.id, {trigger: true});
			}
		}

		/*render: function (){
			this.$el.html( this.template( this.model.toJSON() ) );
			return this;
		}*/


/*		addGame: function( games ) {
			var listView = new app.listGames({ model: PlayerModel });
			this.currentGames.append(listView.render().el );
	    },*/

		


	});
})(jQuery);