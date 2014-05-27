var app = app || {};

(function () {

 
	app.gameModel = Backbone.Model.extend({

		defaults: {						
			game_id: '',
			complete: false,
			active: true,
			turn: '',
			place: '',
			round_result: [{
				story: '',
				card: ''
			}],
			players: []
		},

		idAttribute: '_id',
		
		initialize: function(options){
			/*Use this code for a unique gameid:
				function generateUIDNotMoreThan1million() {
				    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
				}
			*/
			_.bindAll(this,'endGame', 'saveData', 'addWord', 'triggerURL', 'url', 'renderGame');
			//console.log(options);
			
			if (options != undefined){
				if (options.player1 == Number(currentUser)){
					//console.log('gameModel initialized with options id: ');
					//console.log(options._id);
					this.y = options.p1url;
					this.x = options._id;
				} else if (options.player2 == Number(currentUser)){
					//console.log('gameModel initialized with options id: ');
					//console.log(options._id);
					if (options.p2url == ""){
						var m = location.hash;
						var t = m.slice(9);
						this.y = t;
						this.x = options._id;
					} else {
						this.y = options.p2url;
						this.x = options._id;
					}
			    }
			} else {
				this.y = undefined;
			}		
			app.AppView.vent.on('example', function (info){ console.log(info + ' from socket!'); });
			app.AppView.vent.on('updateGameInfo', this.updateGameInfo, this);
			app.AppView.vent.on('removeGame', this.changeActive, this);
			app.AppView.vent.on('requestNewGame', this.rng, this);
		  	app.AppView.vent.on('loadPlayers', this.addPlayers, this);



			//console.log('GameModel initialized with player: ' + this.y + 'and game: ' + this.x);

			var sentence = $('#display_word');

			this.bind('change:sentence', function() {
			    sentence.value = this.get('sentence');
			});

			var test = $('#test');

			this.bind('change:turn', function() {
			    test.value = this.get('turn');
			});

		},

		addPlayers: function(game, to){
			var thisgame = game,
				to = to;
			console.log(to);
			console.log(game);
			var modelPlayers = thisgame.attributes.players;
			var playerInfo = {};
			for ( var i = 0; i < to.length; i++){
			    FB.api(to[i], function (info){
			        var x = info.name,
					    y = info.id,
					    playerInfo = {
					        'name': x, 
					        'fb_id': y,
					        'points': 0
					    }; 
				});
			    modelPlayers.push(playerInfo);
			}
		},

		changeActive: function(model, player){
  			model.save({
  				active: false
  			},{
  				success: function(game){
  					console.log('updated the active state of the model to ' + game.attributes.active);
  				}
  			});

		},

		updateGameInfo: function(game, playerid){
			/*if (game.length > 1){
  				var  games = game;
  				for (var i = 0; i < games.length; i++){
  					this.saveId(games[i]);
  				}
  			} else {
  				this.saveId(game);
  			}
			
  			function saveId(game, playerid){*/
  			this.y = playerid;
  			if (playerid == game.attributes.p1url){
  				var p2id = "";
  			} else {
				var p2id = playerid;
  			}
  				
  				console.log('updateGameInfo received playerid: ' + p2id + ' for game ' + game.id);
  				this.save({
  					p2url: p2id
  				},{
  					success: function(game){
  						console.log('successfully updated game ' + game.id + ' with p2url ' + game.attributes.p2url);
  					}
  				});
  			//}
		},

		endGame: function(info, model){
			if (model.attributes.player1 == Number(currentUser)){
				this.y = info.p1url;
			} else {
				this.y = info.p2url;
			}
			this.x = model.id;
			//var sentence = this.attributes.sentence;
			//var x = String(sentence + end);
			if (info.pointsFor == Number(currentUser)){
				var tp1p = Number(model.attributes.p1points) + Number(info.p1points);
				var tp2p = Number(model.attributes.p2points) + Number(info.p2points);
			} else {
				var tp1p = Number(model.attributes.p1points),
					tp2p = Number(model.attributes.p2points);
			}
			var x = info.message;
			var t = info.url;
			var i = info.complete;
			var o = info.active;
			var l = info.turn;
			var z = this.attributes.points + info.points;
			this.save({
				sentence: x,
				complete: i,
				active: o,
				turn: l,
				game_url: t,
				points: z,
				p1points: tp1p,
				p2points: tp2p
			}, 
			{
				success: function(){
					console.log('successfully ended the game');
					app.AppView.vent.trigger('updatePoints', info.pointsFor, info.points);
				}
			});
		},

		saveData: function(info, model){
			if (model.attributes.player1 == Number(currentUser)){
				this.y = info.p1url;
			} else {
				this.y = info.p2url;
			}
			console.log('info p1url to save to game data is ' + info.p1url);
			console.log('info p2url to save to game data is ' + info.p2url);
			this.x = model.id;
			this.save(this.addWord(info, model), {
				success: function(){
					console.log('success on saving sentence and turn');
					app.AppView.vent.trigger('updatePoints', info.pointsFor, info.points);
				}
			});
		},

		addWord: function(info, model){
			var x = String(info.message);
			var y = String(info.turn);
			if (info.pointsFor == Number(currentUser)){
				var tp1p = Number(model.attributes.p1points) + Number(info.p1points);
				var tp2p = Number(model.attributes.p2points) + Number(info.p2points);
				var z = Number(model.attributes.points) + Number(info.points);
			} else {
				var tp1p = Number(model.attributes.p1points),
					tp2p = Number(model.attributes.p2points),
					z = Number(model.attributes.points);
			}
			console.log('saving the sentence: ' + x);
			console.log('saving the turn for: ' + y);
			console.log('saving points for p1 totalling:' + tp1p);
			console.log('saving points for p2 totalling:' + tp2p);
			console.log('saving game points totalling:' + z);
			if (info.p1url != undefined){
				return {
					sentence: x,
					turn: y,
					points: z,
					p1url: info.p1url,
					p1points: tp1p,
					p2points: tp2p
				}
			} else if (info.p2url != undefined){
				return {
					sentence: x,
					turn: y,
					points: z,
					p2url: info.p2url,
					p1points: tp1p,
					p2points: tp2p
				}
			} else {
				return {
					sentence: x,
					turn: y,
					points: z,
					p1points: tp1p,
					p2points: tp2p
				}
			}			
		},

		triggerURL: function(options){
			if (options !== undefined){
				this.y = options.p1url;
			} else {
				this.y = undefined;
			}	
		},

		url: function(){
			if (this.y !== undefined){
				console.log('gameModel player url is ' + this.y);
				var y = this.y;
				var x = this.x;

				if (x !== undefined){
					console.log('gameModel player url for that.y is ' + y);
					console.log('gameModel game url is ' + x);
					return '/facebook/players/' + y + '/games/' + x;
				} else {
					return '/facebook/players/' + y + '/games';
				}
				
			} else {
				return '/facebook/players/' + 'x' + '/games';
			}
			
		},

		renderGame: function(){
			app.AppRouter.navigate('/players/' + this.y + '/games', true);
			//this.trigger('gameStarted');
		}


	});

})();