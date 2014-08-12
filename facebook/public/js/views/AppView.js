var app = app || {};

(function ($) {
 //       'use strict';

	app.AppView = Backbone.View.extend({
//------Initialize AppView by fetching the players collection and listening for events
//------from the router and the players collection upon login 
		initialize: function  (options) {
			console.log('AppView is initialized.');
			this.startnav();
			this.collection  = new app.Players();
			
			this.gameCollection = new app.Games();
			this.cc = new app.Contact();
			this.cardCollection = new app.Card();
			this.wordCollection = new app.Words();
			this.cardCollection.fetch({reset:true});
			this.wordCollection.fetch({reset:true});

			this.listenTo(app.AppRouter, 'inGame', this.play);
			this.listenTo(app.AppRouter, 'contact', this.contact);
			this.listenTo(app.AppRouter, 'playerOn', this.homeView);

			this.listenTo(this.collection, 'reset', this.render);

			app.AppView.vent.on('requestGame', this.requestDialog, this);
			app.AppView.vent.on('home', this.homeView, this);
			app.AppView.vent.on('options', this.options, this);
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
			app.AppView.vent.on('changeMeta', this.changeMeta, this);
			app.AppView.vent.on('ty', this.ty, this);
			app.AppView.vent.on('tvDone', this.loginPlayer, this);
			app.AppView.vent.on('sendContact', this.sc, this);
			app.AppView.vent.on('showWord', this.loadSW, this);
			app.AppView.vent.on('checkWord', this.checkW, this);

			var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});

			this.home = this.$('#home');
			this.play = this.$('#play');
			this.mfs = this.$('#mfs');
			this.board = this.$('#board');
			this.card = this.$('#card');
			this.sharing = this.$('#sharing');
			this.wc = this.$('#word_countdown');
			this.topnav = this.$('#topnav');
			this.cb = this.$('.cb');
		},

		events: {
			"click #login": "loginPlayer",
			"click #home": "homeView",
			"click #menu" : "options",
			"click #support": "contact",
			"click #about": "about"
		},

		checkW: function(word, gid, pid){
			console.log(word + ' ' + gid + ' ' +pid);
			var playerID = location.hash.slice(10).split('/')[0];
			var game = this.gameCollection.findWhere({_id: gid});
			var player = this.collection.findWhere({_id: pid});
			var word = word;
			var info = {
				game: game.id,
				pid: pid
			};
			var m = false;
			function findSW(element,index,array){
				if(element.name != name && element.sWord == word){
					console.log(name + ' played '  + element.name + '\'s secret word ' + word + '!');
					var match = 'yes';
					Object.defineProperty(info, "match", {value : 'yes',
                         writable : true,
                         enumerable : true,
                         configurable : true});
					Object.defineProperty(info, "sWord", {value : element.sWord,
                         writable : true,
                         enumerable : true,
                         configurable : true});
					Object.defineProperty(info, "pointsFor", {value : element.name,
                         writable : true,
                         enumerable : true,
                         configurable : true});
					Object.defineProperty(info, "playedBy", {value : name,
                         writable : true,
                         enumerable : true,
                         configurable : true});
				} else {
					console.log('no match');
				}
				if(index == array.length-1){
					console.log('last item index ' + index);
				    m = true;
				}
			}
			var gp = game.attributes.players;
			if(pid == playerID){
				gp.forEach(findSW);
			}
			if(m){
				console.log('trigger playedSW');
				app.AppView.vent.trigger('playedSW', info);
			}

		},

		startnav: function(){
			console.log('start triggered');
			$('.h').append('<a class="logoFont" id="home" style="float:none; color:black; font-size:25; text-decoration:none;">fibs</a>');
			$('.m').append('<span class="glyphicon glyphicon-th-large" id="menu" style="margin:25px 10px 0 10px;"></span>');
			$('#home').bind('touchstart', function(){
				console.log('touch home');
				app.AppView.vent.trigger('home');
			});
			$('#menu').bind('touchstart', function(){
				console.log('touch menu');
				app.AppView.vent.trigger('options');
			});
		},

		sc: function(info){
			console.log('sending info to cc');
			console.log(info);
			this.cc.newModel(info);
		},

		ty: function(){
			this.play.html('<h3>Thank you!</h3><br><h3>You\'re comments have been received.</h3>');
			var counter = setInterval(timer, 1000);
			var count = 3;
			var that = this;
			function timer() {
				count=count-1;
				if (count <= 0) {
					clearInterval(counter);
					that.homeView();
					return;
				}
			}
		},

		about: function(){
			this.play.html('<div class="row"><div class="col-md-12 lightBlue" style="border-radius:10px;padding-top:40px;padding-bottom:40px;"><h4>fibs is a classic game you may have played as a child or on a roadtrip.<br style="margin:10px;">As a Facebook game, you can now play this with friends near and far.<br style="margin:10px;">Stay tuned for our crowdfund as we aim to make this an iOS & Android app.<h4></div>');
		},


		tutorial: function(){
			console.log('AppView inside tutorial');
			var tv = new app.tutorialView();
			this.topnav.hide();
			this.play.html(tv.render().el);
		},

		options: function(info){
			console.log('options triggered');
			this.play.html('<div class="row darkBlue" id="support" style="border-top-left-radius:10px; border-top-right-radius:10px;"><div class="col-md-12 darkBlue"><h3>Support</h3></div></div><div class="row lightBlue"  id="about" style="border-bottom-left-radius:10px; border-bottom-right-radius:10px; cursor:pointer;"><div class="col-md-12 lightBlue"><h3>About</h3></div></div>');
		},

		sgp: function(response, info){
			console.log(response);
			console.log(info);
			this.gameCollection.startGameProcess(response, info);
		},

		up: function(info){
			var player = this.collection.findWhere({fb_id: info.playerID});
			player.updateTurn(info);
		},

		contact: function(){
			console.log('contact clicked');
			var cm = new app.contactModel();
			var cv = new app.contactView({model: cm});
			this.play.html(cv.render().el);
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
			console.log(typeof game);
			var that = this;
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
			var secret;
			function getSW(element, index, array){
				if(element.name == name && element.sWord != undefined){
					secret = element.sWord;
				} else if(element.name == name && element.sWord == undefined){
					secret = undefined;
				}
				that.strategy(game_model, secret);
			};

			if(game_model.attributes.gt == 'strategy'){
				console.log('strategy game started');
				var gp = game_model.attributes.players;
				gp.forEach(getSW);
				if(p_stage == 'review'){
					this.gameReview(game_model);
				}
			} else if(p_stage == 'review'){
				var x = level_complete.length;
				var level = level_complete[x-1]; 
				console.log(level);
				app.AppRouter.navigate('#/players/' + player.id + '/games/' + game_model.id + '/round/' + level);
				this.review(game_model, level);
			}else if(p_stage == 'complete'){
				console.log('game is complete, sending player to game review');
				this.gameReview(game_model);
			} else if (level_ip.length != 0){
				//if(game_model.attributes.word_turn == name){
					var level = level_ip[0];
					console.log(level);
					app.AppRouter.navigate('#/players/' + player.id + '/games/' + game_model.id + '/round/' + level);
					/*var cardId = game_model.attributes.round[level-1].card;
					var card = this.cardCollection.findWhere({_id: cardId});
					this.timer(game_model, level, card);
				} else {*/
					var level = level_ip[0];
					this.round(game_model.id, level);
				//}

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

		loadSW: function(word){
			var that = this;
			this.board.hide();
			this.card.hide();
			that.play.html('<div class="row"><div class="col-md-10 col-md-offset-1 lightOrange" id="sWordOK"><h2>play</h2></div><div class="col-md-10 col-md-offset-1"><h2>Your secret word is:<br></h2><h1><strong>' + word + '<strong></h1><button type="button" class="btn btn-danger btn-lg" id="pass">PASS</button></div></div>');
			$('#pass').click(function(){
				app.AppView.vent.trigger('getWord');
				$('#pass').attr('disabled', 'disabled');
			});
			$('#sWordOK').click(function(){
				var g = location.hash.split('/')[4];
				var game = that.gameCollection.findWhere({_id: g});
				that.strategy(game, word);
			});
		},

		strategy: function(game, secret){
			if(secret == undefined){
				app.AppView.vent.trigger('getWord');
			} else {
				console.log(game);
				console.log(secret);
				this.board.show();
				var gameview = new app.gameView({model: game});
				this.play.html(gameview.render().el);
				var r = {
					story: game.attributes.gt_story,
					sWord: secret
				}
				var place = 'online';
				var wt = game.attributes.word_turn;
				var rv = new app.roundView({model: r, place: place});
		        this.board.html(rv.render().el);
		        app.AppView.vent.trigger('wordTurn', wt);
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
			this.topnav.show();
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
			this.play.empty();
			this.play.show();
			this.board.hide();
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
			this.topnav.show();
			var cid = gm.attributes.round[level - 1].card;
			var c = this.cardCollection.findWhere({_id: cid});
			var cv = new app.cardView({model: c});
			this.card.html(cv.render().el);
			this.card.show();
			$('.cb').hide();
			$('#cardTitle').show();
			this.sharing.show();
			this.board.hide();
			var round = gm.attributes.round[level - 1];
			console.log(round);
			var rrv = new app.roundResultView({model: round});
			this.play.html(rrv.render().el);
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
			if(info.room == location.hash.split('/')[4]){
				if(info.playerId != undefined && info.sWord == undefined){
					if (info.close){
						var temp = 'no';
					} else {
						var temp = name + " fibbed, its now your turn!";
					}
					var room = info.room;
					var gm = this.gameCollection.findWhere({_id: room});
					gm.saveData(info);

				} else if(info.playerId != undefined && info.sWord != undefined){
					var room = info.room;
					var gm = this.gameCollection.findWhere({_id: room});
					gm.saveData(info);
				}else {
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
					var temp = "Review your fib with " + name + "!";
					gm.saveData(info, {url: location.hash.slice(0, -6)});
				}
				var gp = gm.attributes.players;
				var url = location.hash;

				var notify = info.notify;
				function getFBID(element, index, array){
					if(element.fb_id != currentUser && element.name == gm.attributes.word_turn){
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
			}
		},

//------Once FB registers the player has logged in, they trigger the click on loginPlayer
//------for our database to find or register the player.
		loginPlayer: function (val){
			if(val == false){
				var val = val;
			} else{var val = undefined;}
			console.log(val);
			console.log('loginPlayer');
			this.collection.fetch({reset:true, 
				success: function(collection){ 
					console.log('about to loginPlayer');
					collection.loginPlayer(val);
				}
			});
		},


//------FB api used to invite friends to play game.
		requestDialog: function(type){
			var type = type;
			console.log(type);
			var ready = false;
			var that = this;
			function opensesame(){
				var player = that.collection.findWhere({fb_id: Number(currentUser)});
				var ngv = new app.newGameSetup({collection: that.gameCollection, gametype: type});
				that.play.html(ngv.render().el);
				app.AppRouter.navigate('#/players/' + player.id + '/games');
			};
			if(type == 'rounds'){
				this.play.html('<div class="light"><h1 style="color:#FFA358;">fibs with rounds</h1><h2>made up of 3 rounds</h2><br><h3>The round begins when one player picks a card.  Each card has a rule &amp; topic .  Enter any word you want as long as it follows the rule and topic on your card. <br><br> Play continues with each player adding one word at a time, until 10 words are played.  Game ends after the third round.</h3></div><div class="row lightOrange" id="ready" style="margin-top:30px;"><h2>got it</h2></div>');
				$('#ready').click(function(){
					console.log('opensesame trigger');
					opensesame();
				});
			} else if(type == 'strategy'){
				this.play.html('<div class="light"><h1 style="color:#FFA358;">fibs with strategy</h1><h2>a one sentence game</h2><br><h3>Each player is given a secret word.  The aim of the game is to get the other player to enter your secret word. When 10 words have been played the game is over.<br><br> If you get the other player to enter your word you win points. If you don\'t like your secret word, you\'re allowed to pass.</h3></div><div class="row deselectedlO" id="ready" style="margin-top:30px;"><h2>coming soon</h2></div>');
				/*$('#ready').click(function(){
					console.log('opensesame trigger');
					opensesame();
				});*/
			}

		}


	});
//----vent used as the Applications event aggregator.
	app.AppView.vent = _.extend({}, Backbone.Events);

})(jQuery);

