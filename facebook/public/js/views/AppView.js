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

		round: function(round){
			console.log('round started with');
			console.log(round);

			var g = location.hash.split('/')[4];
			var rd = location.hash.split('/')[6];
			var gm = this.gameCollection.findWhere({_id: g});

			if (round == typeof object){
				var r = round;
			} else {
				var r = gm.attributes.round[rd];
				console.log(r);
			}
			var gameview = new app.gameView({model: gm});
			this.play.html(gameview.render().el);
			this.board.show();
			this.card.show();
			$('#cardTitle').show();
			$('#cardBody').hide();
	        var rv = new app.roundView({model: r});
	        this.board.html(rv.render().el);
		},

		card: function(info){
			console.log('cards in AppView has card info: ');
			console.log(info);
			this.board.hide();
			this.card.show();
			var level = location.hash.split('/')[6];
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

			var g = location.hash.split('/')[4];
			var p = location.hash.split('/')[2];
			var rd = location.hash.split('/')[6];
			var gm = this.gameCollection.findWhere({_id: g});
			var story = gm.attributes.round[rd].story;
			var z;
			function cid(element, index, array){
			    if(rd == element.round){
				    z = element.card;
			    }
			};
			round_cards.forEach(cid);
			if (story == undefined || story == ''){
				gm.saveData({
					playerId: p,
					room: g,
					level: rd,
					word_turn: gm.attributes.word_turn,
					round_turn: gm.attributes.round_turn,
					in_progress: true,
					card: z,
					word_count: 15
				});
			}
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

