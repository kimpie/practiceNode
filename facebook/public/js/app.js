/*var AppRouter = Backbone.Router.extend({
	routes: {
		//"players/new": "gameButton",
		"/": "gameDetails"
//		"#/players/:player": "gameDetails",
//		"inGame/how": "gameRules",
//		"": "gameDetails",
//		"message-item/new": "example",
//		"message-item/:name": "messageList"
		//"/menu": "menu"
		//"start": "startGame"
	},

/*	initialize: function () {
		this.messages = new Messages();
		this.messages.fetch();

		this.PlayerModel = new playerModel();
		this.PlayerView = new playerView({model: this.PlayerModel});

		//this.LoginView = new loginView({model: this.PlayerModel, el: $('#loggedoff')});

		this.appView = new AppView({model: this.PlayerModel});
	 
	},


//	login: function(){
//		$('#loggedoff').html('Show some text');
//	},

	gameDetails: function () {
//		this.PlayerModel.get(player);
//		this.inGameView.model = this.ActiveGames.get(game);
		$('#app').html(this.appView.render().el);
	},s

	example: function (){
		$('#app').html(this.exMessage.render().el);
	}
});


var app = new AppRouter();

$(function() {
	Backbone.history.start();
});*/
var app = app || {};

$(function () {
        'use strict';

        // kick things off by creating the `App`
        new app.AppView({el: $("#app")});


});
