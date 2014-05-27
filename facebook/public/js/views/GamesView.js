var app = app || {};

(function ($) {

	app.GamesView = Backbone.View.extend({

		template: Handlebars.compile(
		'<div class="row" id="gameview">' +
			'<div class="col-md-4" id="opponenet-panel">'+
				'<div class="row" id="progress_bar">' +
					'<div class="col-md-4">' +
						'<h5>L1</h5>' +
					'</div>' +
					'<div class="col-md-4">' +
						'<h5>L2</h5>' +
					'</div>' +
					'<div class="col-md-4">' +
						'<h5>L3</h5>' +
					'</div>' +
				'</div>' +
				'<h4>Live Fib with</h4>' +
				'<hr></hr>' +
				'<h4>{{player2_name}}</h4>' +
			'</div>' +
			'<div class="col-md-8" id="gameplay">' +
				'<div class="row">'+
					'<div class="col-md-4" id="turn">' +
						'<h5>Turn</h5>'+
					'</div>' +
					'<div class="col-md-4" id="stage">'+
						'<div class="row">' +
							'<div class="col-md-12" id="level"><h5>Level</h5></div>'+
							'<div class="col-md-12" id="stage"><h5>Stage</h5></div>'+
						'</div>' +
					'</div>' +
					'<div class="col-md-4" id="game_up">' +
						'<h5>Timer/Counter</h5>'+
					'</div>' +
				'</div>' +
				'<div class="row">'+
					'<div class="well" id="card"></div>'+	
				'</div>' +
				'<div class="row">' +
					'<div class="col-md-10 col-md-offset-1">' +
						'<div id="sentence">' +
							'<h4>{{sentence}}</h4>' +
						'</div>' +
						'<div><p style="text-align:center"><em>Hitting return or space on the keyboard will submit your word</em></p></div>' +
						'<div id="input">' +
							'<input class="form-control input-lg" id="enter" type="text" name="enter_word" placeholder="enter a word..."></>' +
						'</div>' +
					'</div>' +
				'</div>'+
			'</div>' +
		'</div>' 
		),

		template3: Handlebars.compile(
		'<div class="row" id="gameview">' +
			'<div class="col-md-4" id="opponenet-panel">'+
				'<div class="row" id="progress_bar">' +
					'<div class="col-md-4">' +
						'<h5>L1</h5>' +
					'</div>' +
					'<div class="col-md-4">' +
						'<h5>L2</h5>' +
					'</div>' +
					'<div class="col-md-4">' +
						'<h5>L3</h5>' +
					'</div>' +
				'</div>' +
				'<h4>Live Fib with</h4>' +
				'<hr></hr>' +
				'<h4>{{player2_name}}</h4>' +
			'</div>' +
			'<div class="col-md-8" id="gameplay">' +
				'<div class="row">'+
					'<div class="col-md-4" id="turn">' +
						'<h5>Turn</h5>'+
					'</div>' +
					'<div class="col-md-4" id="stage">'+
						'<div class="row">' +
							'<div class="col-md-12" id="level"><h5>Level</h5></div>'+
							'<div class="col-md-12" id="stage"><h5>Stage</h5></div>'+
						'</div>' +
					'</div>' +
					'<div class="col-md-4" id="game_up">' +
						'<h5>Timer/Counter</h5>'+
					'</div>' +
				'</div>' +
				'<div class="row">'+
					'<div class="well" id="card"></div>'+	
				'</div>' +
				'<div class="row">' +
					'<div class="col-md-10 col-md-offset-1">' +
						'<div id="sentence">' +
							'<h4>{{sentence}}</h4>' +
						'</div>' +
						'<div class="col-md-10 col-md-offset-1" id="input">' +
							'<input class="form-control input-lg" id="disabledInput" type="text" name="enter_word" placeholder="waiting for {{player2_name}}" disabled></>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' +
		'</div>'
		),

		template4: Handlebars.compile(
		'<div class="row" id="gameview">' +
			'<div class="col-md-4" id="opponenet-panel">'+
				'<div class="row" id="progress_bar">' +
					'<div class="col-md-4">' +
						'<h5>L1</h5>' +
					'</div>' +
					'<div class="col-md-4">' +
						'<h5>L2</h5>' +
					'</div>' +
					'<div class="col-md-4">' +
						'<h5>L3</h5>' +
					'</div>' +
				'</div>' +
				'<h4>Live Fib with</h4>' +
				'<hr></hr>' +
				'<h4>{{player2_name}}</h4>' +
			'</div>' +	
			'<div class="col-md-8" id="gameplay">' +
				'<div class="row">'+
					'<div class="col-md-4" id="turn">' +
						'<h5>Turn</h5>'+
					'</div>' +
					'<div class="col-md-4" id="stage">'+
						'<div class="row">' +
							'<div class="col-md-12" id="level"><h5>Level</h5></div>'+
							'<div class="col-md-12" id="stage"><h5>Stage</h5></div>'+
						'</div>' +
					'</div>' +
					'<div class="col-md-4" id="game_up">' +
						'<h5>Timer/Counter</h5>'+
					'</div>' +
				'</div>' +
				'<div class="row">' +
					'<div class="col-md-5 col-md-offset-1" id="points">' +
						'<h5 id="top_point" style="font-weight:bold" class="alignleft">{{player1_name}}</h5><h5 style="font-weight:bold;" id="top_point" class="alignright">{{p1points}}</h5>' +
						'<div style="clear: both;"></div>' +
						'<h5 id="mid_point" class="alignleft">{{player2_name}}</h5><h5 id="mid_point" class="alignright">{{p2points}}</h5>' +
						'<div style="clear: both;"></div>' +
						'<h5 id="btm_point" class="alignleft">Game Points</h5><h5 id="btm_point" class="alignright">{{points}}</h5>' +
						'<div style="clear: both;"></div>' +
					'</div>'+
				'</div>' +
				'<div class="row">' +
					'<div class="col-md-10 col-md-offset-1">' +
						'<div id="notify">' +
						'</div>' +
					'</div>' +	
				'</div>'+
				'<div class="row">' +
					'<div class="col-md-10 col-md-offset-1" id="gameover">' +
						
					'</div>' +
				'</div>'+
				'<div class="row">'+
					'<div class="col-md-10 col-md-offset-1">' +
						'<div id="endsentence">' +
							'<h4>{{sentence}}<h4>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>'+
		'</div>'
		),

	initialize: function  (options) {
		console.log('GamesView triggered with options: ');
		console.log(options);
		this.model = options.model;
		this.model.bind("change", this.render, this);
		this.model.bind("reset", this.render);
		var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
		
		if (this.model.attributes.complete){
			var end = true;
		} else {
			var end = false;
		}
		var sentence = this.model.get('sentence');
		var klen = sentence.length;
			if (klen <= 15){
			var gpoints = 20;
			var status = 'least';
			} else if ( klen >= 16 && klen <= 20){
				var gpoints = 40;
				var status = 'middle';
			} else if (klen >= 21) {
				var gpoints = 60;
				var status = "most";
			} 
		var o = String(this.model.attributes.player1);
		var p = String(this.model.attributes.player2);
		var q = o + p;
		var room = q;
		socket.emit('room', {room: room, message: sentence});
		socket.emit('gameStatus', {room: room, end: end, klen: status})
		app.AppView.vent.on('saveNewSentence', this.sNs, this);
		this.turn = this.$('#turn');
		this.sentence = this.$('#sentence');
		this.timer = this.$('#timer');
		this.render();
	},

	events: {
		'keypress #enter': 'displayChange',
		'click #deleteAndStart' : 'deleteGameforNew',
		'click #deleteGame' : 'removeGame',
		'click #notifybtn' : 'test'
	},

	test: function(){
		console.log('notifybtn clicked');
	},

/*	deleteGameforNew: function(){
		var model = this.model;
		var player = this.model.attributes.player1;
		var deleteGame = confirm('In order to start a new game we\'re going to first delete this game. \n If you want to share it you should cancel out of this and share this game first with friends. \n Are you sure you want to delete this game?');
		if (deleteGame){
			//model.set({active: false});
				var o = String(model.attributes.player1);
				var p = String(model.attributes.player2);
				var q = o + p;
				//tell gamesView to notify this player of new request
				console.log('sending newGameRequest to socket now');
				socket.emit('newGameRequest', {
					room: q,
					playerRequesting: this.model.attributes.player1_name,
					playerRequested: this.model.attributes.player2_name
				});
				socket.emit('example', {test: 'supa-dupa', room: q});
			//app.AppView.vent.trigger('removeGame', model, player);
			/*FB.ui({method: 'apprequests',
		        message: 'Play MadFib with me and make up a crazy story!',
		        to: this.model.attributes.player1
		    }, requestCallback);

		    function requestCallback(response){
		    	app.AppView.vent.trigger('newGameRequest', response);
		    };
		}

	},
*/
	removeGame: function(){
		var player = this.model.attributes.player1;
		var deleteGame = confirm('Are you sure you want to delete this game?  \nIt will be deleted permanently.');
		if (deleteGame){
			app.AppView.vent.trigger('removeGame', this.model, player);
		}
	},

	sNs: function (info){
		var notify = info.notify;
		if ( (info.p1 == this.model.attributes.player1) && (info.p2 == this.model.attributes.player2) ){
			var model = this.model;
			if (info.end){
				this.model.endGame(info, model);
				var temp = this.model.attributes.player1_name  + " has ended the Fib.";
				FB.api('/' + info.p2 + '/notifications',
			        'post',
			        {
			            access_token: notify,
		                href: info.url,
		                template: temp
			            
			        },
			        function (response) {
			          console.log(response);
			          }
		        
			    );
			} else {
				this.model.saveData(info, model);
				console.log('sns triggered in games view 1');
				app.AppView.vent.trigger('playersTurn', info.turn, model);
				/*var count=30;

				var counter=setInterval(timer, 1000); //1000 will  run it every 1 second

				function timer()
				{
				  count=count-1;
				  if (count <= 0)
				  {
				     clearInterval(counter);
				        this.timer.html('times up');
				        console.log('do something at end of timer');
				     return;
				  }

				 document.getElementById("timer").innerHTML= 'Time Remaining' + count;
				}*/
			}
		}
	
		if (Number(currentUser) != info.turn){
			var temp = this.model.attributes.player1_name  + " has updated the Fib, its your turn!";
			FB.api('/' + info.turn + '/notifications',
		        'post',
		        {
		            access_token: notify,
	                href: info.url,
	                template: temp
		            
		        },
		        function (response) {
		          console.log(response);
		          }
	        
		    );
		}
	},

	displayChange: function (event){
		if (event.which == 32 || event.which == 13) {
			var word = jQuery('#enter').val();
			var wl = word.length;
			if (wl <= 3){
				var points = 10;
			} else if ( wl === 4 || wl === 5){
				var points = 15;
			} else if (wl === 6 || wl === 7) {
				var points = 25;
			} else if ( wl === 8 || wl === 9 ){
				var points = 40;
			} else if (wl >= 10){
				var points = 50;
			}
			var modelid = this.model.attributes.player1;
			var url = '#/players/' + this.model.attributes.p1url + '/games/' + this.model.id;

			if (word == "." || word == "?" || word == "!") {
				
				var end = confirm('Using punctuation will end the sentence. \nAre you sure you want to end the game with ' + "\'" + word + "\'");
				var k = this.model.attributes.sentence;
				if (end){
					var klen = k.length;
					if (klen <= 15){
					var gpoints = 20;
					var status = 'least';
					} else if ( klen >= 16 && klen <= 20){
						var gpoints = 40;
						var status = 'middle';
					} else if (klen >= 21) {
						var gpoints = 60;
						var status = "most";
					} 
					var i = location.hash.slice(10).split('/');
					var u = Number(this.model.attributes.player1);
					var sp = Number(this.model.attributes.player2);
					var o = String(this.model.attributes.player1);
					var p = String(this.model.attributes.player2);
					var q = o + p;
					socket.emit('chat', {
						room: q,
						game: this.model,
						word: word,
						message: String(k + word),
						url: url,
						end: true,
						complete: true,
						turn: 0,
						p1: u,
						p2: sp,
						points: points,
						pointsFor: modelid,
						p1p: points + gpoints,
						p2p: gpoints,
						klen: status,
						p1url: i[0]

					});
				} 
			} else {
				console.log(word);
				var i = location.hash.slice(10).split('/');
				var u = Number(this.model.attributes.player1);
				var sp = Number(this.model.attributes.player2);
				var k = this.model.attributes.sentence;
				//var m = this.model.attributes.player2;
				var o = String(this.model.attributes.player1);
				var p = String(this.model.attributes.player2);
				var q = o + p;
				socket.emit('chat', {
					room: q,
					game: this.model,
					word: word,
					message: String(k + " " + word),
					turn: sp,
					p1: u,
					p2: sp,
					points: points,
					url: url,
					p1url: i[0],
					pointsFor: modelid,
					p1p: points,
					p2p: 0
				});
				socket.emit('example', {test: 'supa-dupa', room: q});
			
			}	
		}

	},

	render: function () {
		if ( this.model.get('turn') == Number(currentUser) ) {
			this.$el.html(this.template(this.model.attributes));
			return this;
		} else if ( this.model.get('turn') == Number(this.model.attributes.player2) ) {
			this.$el.html(this.template3(this.model.attributes));
			return this;
		} else if ( (this.model.get('turn') == 0 ) && (this.model.get('complete') == true) ){
			this.$el.html(this.template4(this.model.attributes));
			return this;
		}
		
	}

	});

})(jQuery);