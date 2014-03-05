var app = app || {};

(function () {
 
	app.gameModel = Backbone.Model.extend({
		//urlRoot: '/players',
		defaults: {
			game_id: "",
			p1url: "",
			p2url: "",
			sentence: "",
			complete: "",
			active: "",
			turn: "",
			player1: "",
			player1_name: "",
			player2: "",
			player2_name: ""
		},

		idAttribute: '_id',
		
		initialize: function(options){
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

			console.log('GameModel initialized with player: ' + this.y + 'and game: ' + this.x);
		},

		turn: function(){
			if (this.attributes.turn == Number(currentUser)){
				this.trigger('yourturn');
			}
		},

		saveData: function(word, model){
			this.save(this.addWord(word), {
				success: function(){
					console.log('success on saving sentence and turn');
				}
			})
		},

		addWord: function(word){
			console.log('saving the word: ' + word);
			var sentence = this.attributes.sentence;
			if (this.attributes.player1 == Number(currentUser)){
				var y = this.attributes.player2;
			} else {
				var y = this.attributes.player1;
			}
			if (sentence.length == 0){
				var x = String(word + " ");
				return {
					sentence: x,
					turn: y
				}
			} else {
				var x = String(sentence + word + " ");
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
					if (this.x !== undefined){
						console.log('gameModel url includes ' + this.x);
						return '/players/' + this.y + '/games/' + this.x;
					} else {
						return '/players/' + this.y + '/games';
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