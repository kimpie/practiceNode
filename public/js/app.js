var AppRouter = Backbone.Router.extend({
	routes: {
		"": "games",
		"inGame/how": "gameRules",
		"inGame/:game": "gameDetails"
	},

	initialize: function () {
		this.ActiveGames = new activeGames();
		this.ActiveGames.fetch();

		this.inGameModel = new gameModel();
		this.inGameView = new inGameDetails({model: this.inGameModel});

		this.listGamesView = new listGames({collection: this.ActiveGames});
		this.GameRules = new gameRules({model: new gameModel()});
		 
	},

	games: function () {
		$('#app').html(this.listGamesView.render().el);
	},

	gameDetails: function (game) {
		this.inGameModel.set('id', game);
		this.inGameModel.fetch();
//		this.inGameView.model = this.ActiveGames.get(game);
		$('#app').html(this.inGameView.render().el);
	},

	gameRules: function () {
		$('#app').html(this.GameRules.render().el);
	},

});


var app = new AppRouter();

$(function() {
	Backbone.history.start();
});