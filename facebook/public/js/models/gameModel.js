var app = app || {};

(function () {

 
	app.gameModel = Backbone.Model.extend({

		defaults: {
			game_id: "",
			p1url: "",
			p2url: "",
			sentence: "",
			complete: false,
			active: true,
			turn: "",
			player1: "",
			player1_name: "",
			player2: "",
			player2_name: ""
		},

		idAttribute: '_id',
		
		initialize: function(options){

			_.bindAll(this, 'endGame', 'saveData', 'addWord', 'triggerURL', 'url', 'renderGame');
			console.log(options);
			if (options !== undefined){
				if (this.attributes.player1 === Number(currentUser)){
					console.log('gameModel initialized with options id: ');
					console.log(this.attributes.p1url);
					this.y = this.attributes.p1url;
					this.x = this.id;
				} else if (this.attributes.player2 === Number(currentUser)){
					console.log('gameModel initialized with options id: ');
					console.log(this.attributes.p2url);
					this.y = this.attributes.p2url;
					this.x = this.id;
			    }
			} else {
				this.y = undefined;
			}		
			app.AppView.vent.on('example', function (info){ console.log(info + ' from socket!'); });

			console.log('GameModel initialized with player: ' + this.y + 'and game: ' + this.x);

			var sentence = $('#display_word');

			this.bind('change:sentence', function() {
			    sentence.value = this.get('sentence');
			});

			var test = $('#test');

			this.bind('change:turn', function() {
			    test.value = this.get('turn');
			});
		},

		endGame: function(allSentence, url){
			//var sentence = this.attributes.sentence;
			//var x = String(sentence + end);
			var x = allSentence;
			this.save({
				sentence: x,
				complete: true,
				active: false,
				turn: "",
				game_url: url
			}, 
			{
				success: function(){
					console.log('successfully ended the game');
				}
			});
		},

		saveData: function(info){
			this.save(this.addWord(info), {
				success: function(){
					console.log('success on saving sentence and turn');
				}
			});
		},

		addWord: function(info){
			//var sentence = this.attributes.sentence;
			var x = String(info);
			console.log('saving the sentence: ' + x);
			if (this.attributes.player1 == Number(currentUser)){
				var y = this.attributes.player2;
				return {
					sentence: x,
					turn: y
				}
			} else {
				var y = this.attributes.player1;
				return {
					sentence: x,
					turn: y
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

				if (this.x !== undefined){
					console.log('gameModel player url for that.y is ' + y);
					console.log('gameModel game url is ' + this.x);
					return '/players/' + y + '/games/' + this.x;
				} else {
					return '/players/' + y + '/games';
				}
				
			} else {
				return '/players/' + 'x' + '/games';
			}
			
		},

		renderGame: function(){
			app.AppRouter.navigate('/players/' + this.y + '/games', true);
			//this.trigger('gameStarted');
		}


	});

})();