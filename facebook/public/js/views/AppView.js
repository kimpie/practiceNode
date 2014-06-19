var app = app || {};

(function ($) {
 //       'use strict';

	app.AppView = Backbone.View.extend({
//------Initialize AppView by fetching the players collection and listening for events
//------from the router and the players collection upon login 
		initialize: function  (options) {
			console.log('AppView is initialized.');

			this.collection  = new app.Players();
			
			this.gameCollection = new app.Games();
			this.cc = new app.Contact();
			this.cardCollection = new app.Card();
			this.cardCollection.fetch({reset:true});

			this.listenTo(app.AppRouter, 'inGame', this.play);
			this.listenTo(app.AppRouter, 'contact', this.contact);

			this.listenTo(this.collection, 'reset', this.render);

			app.AppView.vent.on('requestGame', this.requestDialog, this);
			app.AppView.vent.on('home', this.homeView, this);
			app.AppView.vent.on('playGame', this.play, this);
			app.AppView.vent.on('showCard', this.card, this);
			app.AppView.vent.on('startRound', this.round, this);
			app.AppView.vent.on('showTimerInfo', this.timer, this);

			app.AppView.vent.on('launchFetch', this.go, this);
			app.AppView.vent.on('removeGame', this.removeGame, this);

			this.home = this.$('#home');
			this.play = this.$('#play');
			this.mfs = this.$('#mfs');
			this.board = this.$('#board');
			this.card = this.$('#card');
			this.sharing = this.$('#sharing');
		},

		//------Two events, when a user logs in to FB and when they invite friends to join
		events: {
			"click #login": "loginPlayer",
			"click #home": "homeView",
			"click #contact" : "contact"

		},


		contact: function(){
			var cm = new app.contactModel();
			var cv = new app.contactView({model: cm});
			this.game.html(cv.render().el);
		},

		homeView: function(player){
			console.log('player received in homeView');
			console.log(player);
			var playermodel = this.collection.findWhere({fb_id: Number(currentUser)});
			app.AppRouter.navigate('#/players/' + playermodel.id)
			this.board.hide();
			this.card.hide();
			var hv = new app.homeView({model: playermodel});
			this.play.html(hv.render().el);	
		},


		go: function(player, pcGames){
			console.log('go in AppView');
			var player = player;
			var pcGames = pcGames;
			var that = this;
			this.gameCollection.fetch({reset:true, 
				success: function(){ 
					app.AppView.vent.trigger('checkForGames', player, pcGames);
					that.homeView(player);
				}
			});
		},

		removeGame: function(model, player){
			var gameModel = model;
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
			app.AppView.vent.trigger('modelRemove', gameModel, player);
		},


//------Upon friend invite to start game, play receives game model and pass it to games view
//------to initialize, if player 1 is logged in gameview opens, if player 2 gameview 2.
		play: function(game){
			console.log('play triggered from AppView with game: ');
			console.log(game);
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
			if(typeof game == "string"){
				var game_model = this.gameCollection.findWhere({_id: game});
			} else if (typeof game == "object"){
				var game_model = game;
			}
			var level = game_model.checkRounds();
			this.board.show();
			if(level != undefined){
				if(game_model.attributes.round[level].review){
					app.AppRouter.navigate('#/players/' + player.id + '/games/' + game + '/round/' + level);
					var gameview = new app.gameView({model: game_model});
					this.play.html(gameview.render().el);
					app.AppView.vent.trigger('doneBtn');
					var rrv = new app.roundResultView({model: game_model.attributes.round[level]});
					this.board.html(rrv.render().el);
					this.sharing.show();
				} else {
					app.AppRouter.navigate('#/players/' + player.id + '/games/' + game + '/round/' + level);
					this.timer();
				}
			} else {
				var gameview = new app.gameView({model: game_model});
				this.play.html(gameview.render().el);
				var bv = new app.boardView({model: game_model});
		        this.board.html(bv.render().el);
				app.AppRouter.navigate('#/players/' + player.id + '/games/' + game);
			}
		},

		round: function(game, round){
			var round = round;
			var game = game;
			console.log('round started with');
			console.log(round);
			console.log(game);
			console.log(location);
			if (game != undefined){
				var g = game;
			} else {
				var g = location.hash.split('/')[4];
			}
			var gm = this.gameCollection.findWhere({_id: g});
			if (round != undefined){
				var rindex = round - 1;
				if (round == typeof object){
					var r = round;
				} else {
					var r = gm.attributes.round[rindex];
					console.log(r);
				}
			} else {
				var rd = location.hash.split('/')[6];
			}
			console.log(gm);
			var gameview = new app.gameView({model: gm});
			this.play.html(gameview.render().el);
			this.board.show();
			this.card.show();
			if(gm.attributes.word_countdown == 15){
				var rc = round_cards[0].card;
			} else {
				var rc = r.card;
			}
			console.log(r);
			console.log(rc);
			var c = this.cardCollection.findWhere({_id: rc});
			var cv = new app.cardView({model: c});
			this.card.html(cv.render().el);
			$('#cardTitle').show();
			$('#cardBody').hide();
	        var rv = new app.roundView({model: r});
	        this.board.html(rv.render().el);
	        app.AppView.vent.trigger('wordTurn', gm.attributes.word_turn);
		},

		card: function(info){
			console.log('cards in AppView has card info: ');
			console.log(info);
			this.board.hide();
			this.card.show();
			var level = info.attributes.level;
			round_cards =[{round: level, card: info.id}]; 
			app.AppView.vent.trigger('startBtn');
			var cv = new app.cardView({model: info});
			this.card.html(cv.render().el);
		},

		timer: function(){
			this.board.hide();
			this.card.hide();
			var tv = new app.timerInfo();
			this.play.html(tv.render().el);
		},

//------Once FB registers the player has logged in, they trigger the click on loginPlayer
//------for our database to find or register the player.
		loginPlayer: function (){
			console.log('loginPlayer');
			this.collection.fetch({reset:true, 
				success: function(collection){ 
					console.log('about to loginPlayer');
					collection.loginPlayer();
				}
			});
		},

//------FB api used to invite friends to play game.
		requestDialog: function(){
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
			var that = this;
			var ngv = new app.newGameSetup({collection: that.gameCollection});
			this.play.html(ngv.render().el);
			app.AppRouter.navigate('#/players/' + player.id + '/games');
		}


	});
//----vent used as the Applications event aggregator.
	app.AppView.vent = _.extend({}, Backbone.Events);

})(jQuery);

