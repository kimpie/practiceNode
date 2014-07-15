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
			this.listenTo(app.AppRouter, 'playerOn', this.homeView);

			this.listenTo(this.collection, 'reset', this.render);

			app.AppView.vent.on('requestGame', this.requestDialog, this);
			app.AppView.vent.on('home', this.homeView, this);
			app.AppView.vent.on('playGame', this.play, this);
			app.AppView.vent.on('showCard', this.card, this);
			app.AppView.vent.on('startRound', this.round, this);
			app.AppView.vent.on('showTimerInfo', this.timer, this);
			app.AppView.vent.on('updateP', this.up, this);
			app.AppView.vent.on('review', this.review, this);
			app.AppView.vent.on('ab', this.sendGD, this);
			app.AppView.vent.on('sgp', this.sgp, this);
			app.AppView.vent.on('launchFetch', this.go, this);
			app.AppView.vent.on('removeGame', this.removeGame, this);
			app.AppView.vent.on('showTutorial', this.tutorial, this);

			var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});

			this.home = this.$('#home');
			this.play = this.$('#play');
			this.mfs = this.$('#mfs');
			this.board = this.$('#board');
			this.card = this.$('#card');
			this.sharing = this.$('#sharing');
			this.wc = this.$('#word_countdown');
			this.topnav = this.$('#topnav');
			this.app = this.$('#app');
			this.cb = this.$('.cb');
		},

		events: {
			"click #login": "loginPlayer",
			"click #home": "homeView",
			"click #contact" : "contact",
			"click #menu" : "options"
		},

		tutorial: function(){
			var tv = new app.tutorialView();
			this.app.html(tv.render().el);
		},

		options: function(info){
			this.play.html('')
		},

		sgp: function(response, info){
			console.log(response);
			console.log(info);
			this.gameCollection.startGameProcess(response, info);
		},

		up: function(playerID, game, round){
			var player = this.collection.findWhere({fb_id: playerID});
			player.updateTurn(game, round);
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
			if (location.hash != '#/players/' + playermodel.id){
				app.AppRouter.navigate('#/players/' + playermodel.id);
			}
			this.sharing.hide();
			this.board.hide();
			this.card.hide();
			this.topnav.show();
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

		removeGame: function(model, p, stage){
			var gameModel = model;
			console.log(model);
			console.log(p);
			console.log(stage);
			if(p != undefined && p != ''){
				var player = this.collection.findWhere({fb_id: p});
			} else {
				var player = this.collection.findWhere({fb_id: Number(currentUser)});
			}
			player.removeGame(gameModel, player, stage);
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
			var level_complete = game_model.checkRounds('complete');
			console.log('rounds complete are : ' + level_complete);
			var level_ip = game_model.checkRounds('in_progress');
			console.log('round in_progress are ' + level_ip);
			this.board.show();
			var p_stage = game_model.checkStage(currentUser);
			console.log('insdie AppView play, in stage ' + p_stage);
			if(p_stage == 'review'){
				var x = level_complete.length;
				var level = level_complete[x-1]; 
				console.log(level);
				app.AppRouter.navigate('#/players/' + player.id + '/games/' + game_model.id + '/round/' + level);
				this.review(game_model, level);
			}else if(p_stage == 'complete'){
				console.log('game is complete, sending player to game review');
				this.gameReview(game_model);
			} else if (level_ip.length != 0){
				var level = level_ip[0];
				console.log(level);
				app.AppRouter.navigate('#/players/' + player.id + '/games/' + game_model.id + '/round/' + level);
				var cardId = game_model.attributes.round[level-1].card;
				var card = this.cardCollection.findWhere({_id: cardId});
				this.timer(game_model, level, card);
				//}
			}else {
				this.sharing.hide();
				this.card.hide();
				this.wc.hide();
				this.board.hide();
				this.topnav.hide();
				//var gameview = new app.gameView({model: game_model});
				//this.play.html(gameview.render().el);
				var bv = new app.boardView({model: game_model, complete: level_complete});
				if(game_model.attributes.round[2].complete){
					app.AppView.vent.trigger('newGameBtn');
				}
		        this.play.html(bv.render().el);
				app.AppRouter.navigate('#/players/' + player.id + '/games/' + game_model.id);
			}
		},

		round: function(game, round){
			var round = round;
			var game = game;
			console.log('round started with');
			console.log(round);
			console.log(game);
			console.log(location.hash);
			if (game != undefined){
				var g = game;
			} else {
				var g = location.hash.split('/')[4];
			}
			var gm = this.gameCollection.findWhere({_id: g});
			var place = gm.attributes.place;
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
			this.wc.show();
			this.topnav.hide();
			if(gm.attributes.word_countdown == 10){
				var rc = round_cards[0].card;
			} else {
				var rc = r.card;
			}
			var gp = gm.attributes.players;
			var turn;
			function getController(element, index, array){
				if(element.controller == true){
					turn = element.name;
				}
			};
			gp.forEach(getController);
			if (turn == undefined || turn == ''){
				var wt = gm.attributes.word_turn;
			} else {
				var wt = turn;
			}		
			console.log(r);
			console.log(rc);
			var c = this.cardCollection.findWhere({_id: rc});
			var cv = new app.cardView({model: c});
			this.card.html(cv.render().el);
			this.card.show();
			$('.cb').hide();
			$('#cardTitle').show();
			$('#cardBody').hide();
	        var rv = new app.roundView({model: r, place: place});
	        this.board.html(rv.render().el);
	        app.AppView.vent.trigger('wordTurn', wt);
		},

		card: function(info){
			console.log('cards in AppView has card info: ');
			console.log(info);
			this.board.hide();
			this.sharing.hide();
			this.card.show();
			this.play.hide();
			this.topnav.hide();
			$('.cb').show();
			var level = info.attributes.level;
			round_cards =[{round: level, card: info.id}]; 
			var cv = new app.cardView({model: info});
			this.card.html(cv.render().el);
		},

		timer: function(game_model, round, card){
			this.card.hide();
			this.topnav.hide();
			this.play.show();
			if(typeof game_model == 'object'){
				var gm = game_model;
			} else {
				var gm = this.gameCollection.findWhere({_id: game_model});
			}
			if(gm.attributes.place == 'Live'){
				var count = 60;
			} else {
				if(round == '1'){
					var count = 20;
				} else if(round == '2'){
					var count = 15;
				} else if(round == '3'){
					var count = 10;
				}
			}
			var card = card;
			console.log(card);
			var direction = card.attributes.direction;
			var rule = card.attributes.rule;
			var tv = new app.timerInfo({count: count, direction: direction, rule: rule});
			this.play.html(tv.render().el);
		},

		review: function(game_model, level){
			if(typeof game_model == 'object'){
				var gm = game_model;
			} else {
				var gm = this.gameCollection.findWhere({_id: game_model});
			}
			console.log('review has level: ' + level + ' and game_model ');
			console.log(game_model);
			//var gameview = new app.gameView({model: gm});
			//this.play.html(gameview.render().el);
			//app.AppView.vent.trigger('doneBtn');
			//this.board.show();
			this.board.hide();
			var rrv = new app.roundResultView({model: gm.attributes.round[level - 1]});
			this.play.html(rrv.render().el);
			this.card.show();
			this.topnav.show();
			var cid = gm.attributes.round[level - 1].card;
			var c = this.cardCollection.findWhere({_id: cid});
			var cv = new app.cardView({model: c});
			this.card.html(cv.render().el);
			this.cb.hide();
			this.sharing.show();
		},

		gameReview: function(game){
			this.board.hide();
			this.topnav.show();
			this.card.hide();

			var gr = new app.gameReview({model: game});
			this.play.html(gr.render().el);
		},

		sendGD: function (info){
			console.log(info);
			if(info != undefined){
				if (info.close){
					var temp = 'no';
				} else {
					var temp = "Your fib!";
				}
				var room = info.room;
				var gm = this.gameCollection.findWhere({_id: room});
				gm.saveData(info, {url: location.hash.slice(0, -6)});
			} else {
				var room = location.hash.split('/')[4];
				var round = location.hash.split('/')[6];
				var info = {
					room: room,
					level: round,
					playerId: location.hash.slice(10).split('/')[0],
					word_countdown: 0,
					close: true
				};
				var gm = this.gameCollection.findWhere({_id: room});
				var temp = "Review this fib!"
				gm.saveData(info, {url: location.hash.slice(0, -6)});
			}
			var gp = gm.attributes.players;
			var url = 'https://apps.facebook.com/playfibs';
			var notify = info.notify;
			function getFBID(element, index, array){
				if(element.fb_id != currentUser){
				FB.api('/' + element.fb_id + '/notifications',
			        'post',
			        {
			            access_token: notify,
		                href: url,
		                template: temp
			            
			        },
			        function (response) {
			          console.log(response);
			          }
			    );
				}
			}
			if(gm.attributes.place != 'Live'){
				if(temp != 'no'){
					gp.forEach(getFBID);
				}
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

