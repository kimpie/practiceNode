var app = app || {};

(function ($) {

	Handlebars.registerHelper('firstName', function(name) {
	  return name.split(' ')[0];
	}),

	Handlebars.registerHelper('ifLive', function(place, options) {
		console.log(place);
	  if(place == 'Live') {
	    return options.fn(this);
	  } 
	}),

	app.gameView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row top_gv">' +
				'<div class="col-md-2 col-md-offset-2" id="word_countdown">' + 
					'<h5>Words Remaining</h5>' +
					'<h5>{{word_countdown}}</h5>' +
				'</div>' +
				'<div class="col-md-6" id="playerList">'+
					'<ul>'+
					'{{#each players}}' +
						'<li id="players" class="{{firstName name}}">{{name}}</li>'+
					'{{/each}}'+
					'{{#ifLive place}}' +
						'<li id="players"><a id="addPlayer"><span class="glyphicon glyphicon-plus"></span></a></li>' +
					'{{/ifLive}}'+
					'</ul>'+ 
				'</div>'+
				'<div class="row">' +
					'<div class="col-md-12" id="playerTurn">'+
						'<h3>{{round_turn}} starts this Fib</h3>' +
					'</div>'+
					'<div class="col-md-8 col-md-offset-2" id="action"></div>'+
				'</div>' +
			'</div>'
		),

	initialize: function  (options) {
		console.log('gameView triggered with options: ');
		console.log(options);
		this.model = options.model;
		this.room = options.model.id;
		this.model.saveRound();
		this.model.bind("change", this.render, this);
		this.model.bind("reset", this.render);
		app.AppView.vent.on('showCard', this.showCard, this);
		app.AppView.vent.on('startBtn', this.showbtn, this);
		app.AppView.vent.once('sendWord', this.endOfTimer, this);
		//app.AppView.vent.on('saveNewSentence', this.sNs, this);
		app.AppView.vent.on('startTimer', this.startTimer, this);
		app.AppView.vent.on('doneBtn', this.donebtn, this);
		app.AppView.vent.on('newGameBtn', this.ngb, this);
		//Socket information
		var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
		socket.emit('room', {room: this.room});

		if (this.model.attributes.place == "live"){
			this.live = true;
		} else {
			this.live = false;
		}

		if (this.model.attributes.word_turn == name){
			$('#input').html('<input class="form-control" id="enter" type="text" name="enter_word" placeholder="Your turn to Fib!"></>');
		}
	},

	events: {
		'click #addPlayer' : 'addPlayer',
		'click #startRound': 'startRound',
		'click .closeRound' : 'closeRound',
		'click #gameView' : 'gotogame',
		'click #playAgain' : 'startOver'
	},

	ngb: function(){
		$('#action').empty();
		$('#playerTurn').html('<button class="btn btn-success btn-block btn-lg" id="playAgain">Game Over.  Play again?</button>');
	},

	startOver: function(){
		var place = this.model.attributes.place;
		var people = 'Group';
		var info = [place, people];
		var gp = this.model.attributes.players;
		var x = [];
		function fbid(element, index, array){
			console.log('inside fbid on player fb_id ' + element.fb_id);
			x.push(element.fb_id);
		};
		gp.forEach(fbid);
		console.log(x);
		var response = {
			to: x
		};
		app.AppView.vent.trigger('sgp', response, info);
	},

	gotogame: function(){
		app.AppRouter.navigate()
	},

	donebtn: function(){
		$('#playerTurn').hide();
		$('#word_countdown').hide();
		var level = location.hash.split('/')[6];
		if(this.model.attributes.round[level - 1].complete || this.model.attributes.round[level - 1].review){
			$('#action').html('<a class="btn btn-success btn-block btn-lg" href="' + location.hash.substr(0, location.hash.length - 17) + '">Back to Game</a>');
		} else if (this.model.attributes.round_turn == name){
			$('#action').html('<button class="btn btn-success btn-block btn-lg closeRound" id="gameView">Begin Next Round</button>');
		} else {
			$('#action').html('<button class="btn btn-success btn-block btn-lg closeRound" id="home">Take me home, waiting for {{round_turn}} to begin next round</button>');
		}
	},

	closeRound: function(){
		var that = this;
		var round = location.hash.slice(10).split('/')[4];
		var info = {
			room: that.room,
			level: round,
			playerId: location.hash.slice(10).split('/')[0],
			close: true
		}
		app.AppView.vent.trigger('sendGameData', info);
		/*this.model.saveData({
			close: true,
			review: false,
			level: round,
			playerId: location.hash.slice(10).split('/')[0],
			room: that.room,
			word_turn: that.model.attributes.round_turn,
			story: that.model.attributes.round[round-1].story,
			card: that.model.attributes.round[round-1].card,
			in_progress: false,
			round_turn: that.model.attributes.round_turn,
			word_countdown: 10
		}, {url: location.hash.slice(0, -6)});*/
	},

	showbtn: function(){
		if (this.model.attributes.round_turn == name){
			$('#action').html('<button class="btn btn-success btn-block" id="startRound">Start</button>');
		} 
	},

	inRound: function(level){
		$('#action').empty();
		$('#playerTurn, div#cardTitle').show();
		$('div#card').hide();
		if(this.model.attributes.round[level].story !== undefined){
			$('#story').css('display', 'block');
			$('#storyText').append(this.model.attributes.round[level].story);
		} else {
			$('#story').css('display', 'none');
		}
	},

	addPlayer: function(){
		console.log('Add Another Player to this Game');
	},

	startRound: function(){
		var round = location.hash.slice(10).split('/')[4];
		app.AppView.vent.trigger('showTimerInfo', round);
	},

	startTimer: function(round){
		if (this.live){
			this.count = 60;
		} else {
			if(round == 1){
				this.count = 30;
			}else if(round == 2){
				this.count = 20;
			}else{
				this.count = 10;
			}
		}
		var counter = setInterval(timer, 1000);
		$('#playerTurn, #action').empty();
		var that = this;
		function timer() {
			that.count=that.count-1;
			if (that.count <= 0) {
				clearInterval(counter);
				console.log('counter ended');
				//that.endOfTimer();
				return;
			}
			if(that.live){
				$('#action').progressbar({
					max: 60,
					value: that.count
				});
			} else {
				if(round == 1){
					$('#action').progressbar({
						max: 30,
						value: that.count
					});
				}else if(round == 2){
					$('#action').progressbar({
						max: 20,
						value: that.count
					});
				}else{
					$('#action').progressbar({
						max: 10,
						value: that.count
					});
				}
				
			}

		}	
	},

	/*endOfTimer: function(info){
		//if info is not undefined, a word has been entered and received from roundView
		if(info != undefined){
			//check to make sure we have the right room, not sending to another game
			if (info.room == this.room){
				var word = info.word;
				this.count = 0;
				var that = this;
				if (that.live){
					console.log('game is live, not saving until end of round');
				} else {
					var	level = location.hash.slice(10).split('/')[4],
						rIndex = level - 1,
						k = that.model.attributes.round[rIndex].story,
						pid = location.hash.slice(10).split('/')[0];
					if (k != undefined && k != ''){
						var story = String(k + ' ' + word);
					} else {
						var story = word;
					}
					var wc = that.model.attributes.word_countdown - 1;
					if(wc == 0){
						var rev = true;
						var rturn = that.model.rotateTurn({round_turn: true});
						var wturn = rturn;
					} else { 
						var rev = false; 
						var rturn = that.model.attributes.round_turn;
						var wturn = that.model.rotateTurn({round_turn: false});
					}
					console.log('word_countdown is ' + wc);
					if (wturn != undefined && wturn != ''){
						console.log('inside submitWord');
						var info = {
							level: level,
							room: that.room,
							word: word,
							story: story,
							playerId: pid,
							word_countdown: wc,
							word_turn: wturn,
							round_turn: rturn,
							in_progress: true,
							review: rev
						};
						this.sNs(info);
					}
				}// if/else live/online
			} else {   //info.room if/else
				console.log(info.room + ' doesn\'t match this.room: ' + this.room);
			}
		
		} else {
			var story = $('#storyText').val(),
			pid = location.hash.slice(10).split('/')[0],
			level = location.hash.slice(10).split('/')[4];
			var that = this;
			if (this.live){
					var turn = that.model.rotateTurn({round_turn:true});
					if (turn != undefined && turn != ''){
						var info = {
							level: level,
							room: that.room,
							round_turn: turn,
							playerId: pid,
							card: this.card,
							story: story,
							in_progress: false
						};
						this.sNs(info);
					}
			} else {
				//if no word is entered, save the game at end of timer.
				if($('#enter').val() == ''){
					var turn = that.model.rotateTurn({round_turn:false});
					var	level = location.hash.slice(10).split('/')[4];
					if (turn != undefined && turn != ''){
						var info = {
							level: level,
							room: that.room,
							playerId: pid,
							word_turn: turn,
							round_turn: that.model.attributes.round_turn,
							card: that.card,
							in_progress: true,
							story: that.model.attributes.round[level - 1].story
						};
						this.sNs(info);
					}						
				}
			}
		}
		
	},


	sNs: function (info){
		var notify = info.notify;
		if (info.room == this.room){
			var model = this.model;
			var that = this;
			console.log('sns in gameview triggering model.saveData');
			model.saveData(info, {url: location.hash.slice(0, -6)});
			var temp = "It\'s your turn to Fib!";
			/*FB.api('/' + info.turn + '/notifications',
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
	},*/

	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;		
	}

	});

})(jQuery);

