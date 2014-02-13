

	var AppController = {

		/*initialize: function () {
			this.userName = this.$('#userName');	
			console.log('AppController initialized.');
			this.router = new AppRouter();
		},*/
		
		playerDetails: function(player){
			app.AppRouter.navigate('/player/' + player.id);

		},

		showPlayerDeatils: function(player){
			this.userName = this.$('#userName');
			var playerView = new app.PlayersView({model: player});
			this.userName.append(playerView.render().el);
			playerView.on("goto:playerDetails", this.playerDetails, this);
		}
		/*this.playerDetails(player){
			
		};*/
	};

	/*var vent = _.extend({}, Backbone.Events);
	var players = new app.Players({vent: vent});
	var controller = new AppController();
	var router = new AppRouter({controller: controller});
	console.log('Initial variables have been set.');

	vent.bind("player:loggedin", function(player){
		controller.playerDetails(player);
		router.navigate("/players/" + player.id);
	});*/

