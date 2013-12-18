var AppRouter = Backbone.Router.extend({
	routes: {
		"": "games",
		"inGame/how": "gameRules",
		"inGame/:game": "gameDetails",
		"/facebook" : "gameDetails",
		"message-item/new": "example",
		"message-item/:name": "messageList"
		//"start": "startGame"
	},

	initialize: function () {
		this.ActiveGames = new activeGames();
		this.ActiveGames.fetch();

		this.messages = new Messages();
		this.messages.fetch();

		this.inGameModel = new gameModel();
		this.inGameView = new inGameDetails({model: this.inGameModel});

		this.listGamesView = new listGames({collection: this.ActiveGames});
		this.GameRules = new gameRules({model: new gameModel()});

		this.newMessage = new messageModel();
		this.exMessage = new messageView({model: this.newMessage});

		/*this.newGameModel = new Game();
		this.newGameView = new GameView({model: this.newGameModel});*/
		 
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

	example: function (){
		$('#app').html(this.exMessage.render().el);
	}

/*	startGame: function () {
		$('#app').html(this.newGameView.render().el);

	}
*/
});


var app = new AppRouter();

$(function() {
	Backbone.history.start();
});