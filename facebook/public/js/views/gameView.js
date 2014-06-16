var app = app || {};

(function ($) {

	Handlebars.registerHelper('firstName', function(name) {
	  return name.split(' ')[0];
	}),

	app.gameView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row top_gv">' +
				'<div class="col-md-8 col-md-offset-2" id="playerList">'+
					'<ul>'+
					'{{#each players}}' +
						'<li id="players" class="{{firstName name}}">{{name}}</li>'+
					'{{/each}}'+
					'<li id="players"><a id="addPlayer"><span class="glyphicon glyphicon-plus"></span></a></li>' +
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
		app.AppView.vent.on('sendWord', this.submitWord, this);
		app.AppView.vent.on('saveNewSentence', this.sNs, this);
		app.AppView.vent.on('startTimer', this.startTimer, this);
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
		var p = this.model.attributes.players;
		var that = this;
		function findTurn(element, index, array){
			if (that.model.attributes.word_turn == element.name){
				var n = element.name.split(' ')[0];
				console.log($('.' + n));
				$('.' + n).css({'background-color' : 'yellow'});
			}
		}
		p.forEach(findTurn);
	},

	events: {
		'click #addPlayer' : 'addPlayer',
		'click #startRound': 'startRound',
		'click #share': 'share',
		'click #like': 'like'
	},

	showbtn: function(){
		if (this.model.attributes.round_turn == name){
			$('#action').html('<button class="btn btn-success btn-block" id="startRound">Start</button>');
		} 
	},

	inRound: function(level){
		console.log('inRound with word_turn for :' + this.model.attributes.word_turn + ' and round_turn for ' + this.model.attributes.round_turn);
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
		console.log('startRound inside GAMEvIEW');
		app.AppView.vent.trigger('showTimerInfo');
	},

	startTimer: function(){
		console.log('startTimer inside GAMEvIEW');
		if (this.live){
			this.count = 60;
		} else {
			this.count = 30;
		}
		var counter = setInterval(timer, 1000);
		$('#playerTurn, #action').empty();
		var that = this;
		function timer() {
			that.count=that.count-1;
			if (that.count <= 0) {
				clearInterval(counter);
				console.log('counter ended');
				that.endOfTimer();
				return;
			}
			$('#action').progressbar({
				max: 60,
				value: that.count
			});
		}	
	},

	endOfTimer: function(){
		var story = $('#storyText').val(),
			pid = location.hash.slice(10).split('/')[0],
			level = location.hash.slice(10).split('/')[4];
		console.log('endOfTime has pid: ' + pid);
		var that = this;
		if (this.live){
				var turn = that.model.rotateTurn({round_turn:true});
				if (turn != undefined && turn != ''){
					socket.emit('chat', {
						level: level,
						room: that.room,
						round_turn: turn,
						playerId: pid,
						card: this.card,
						story: story,
						in_progress: false
					});
				}
				console.log('show round result');
		} else {
			//if no word is entered, save the game at end of timer.
			if($('#enter').val() == ''){
				console.log('word wasn\'t entered, you lose this turn');
				var turn = that.model.rotateTurn({round_turn:false});

				/*if (turn != undefined && turn != ''){*/
					socket.emit('chat', {
						leve: level,
						room: that.room,
						playerId: pid,
						word_turn: turn,
						round_turn: that.model.attributes.round_turn,
						card: that.card,
						in_progress: true
						});
					$('#input').html('<input type="text" id="disabledTextInput" class="form-control" placeholder="Waiting for the next fib" disabled>');
				//}
			}
		}
	},

	submitWord: function(info){
		console.log('submitWord called with info:');
		console.log(info.word + ' ' + info.room);
		console.log('On player ' + location.hash.slice(10).split('/')[0] + ' in room ' + this.room);
		if (info.room == this.room){
			var word = info.word;
			this.count = 0;
			var that = this;
			if (that.live){
				console.log('game is live, not saving until end of round');
			} else {
				var	level = location.hash.slice(10).split('/')[4],
					k = that.model.attributes.round[level].story,
					pid = location.hash.slice(10).split('/')[0];
				console.log(k);
				if (k != undefined && k != ''){
					story = String(k + ' ' + word);
				} else {
					story = word;
				}
				var turn = that.model.rotateTurn({round_turn: false});
				console.log('submitWord received new turn for: ' + turn);
				console.log(turn != undefined && turn != '');
				if (turn != undefined && turn != ''){
					console.log('ready for socket emit');
					socket.emit('chat', {
						level: level,
						room: that.room,
						word: word,
						story: story,
						playerId: pid,
						word_turn: turn,
						round_turn: that.model.attributes.round_turn,
						in_progress: true
					});
					//$('#input').html('<input type="text" id="disabledTextInput" class="form-control" placeholder="Waiting for the next fib" disabled>');
				}
			}
		} else {
			console.log(info.room + ' doesn\'t match this.room: ' + this.room);
		}
		
	},

	sNs: function (info){
		console.log(info);	
		var notify = info.notify;
		console.log('GAMEvIEW: socket sent info for room ' + info.room + ' to ' + this.room);
		if (info.room == this.room){
			var model = this.model;
			var that = this;
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
	        
		    );*/
		}
	},

	showResult: function(){
		console.log('showResult rendered');
		$('#playerTurn').empty();
		$('#story').show();
		$('#action').append('Next round');
		$('#input').empty().append('<button class="btn-default" id="share">Share</button><button class="btn-default" id="like">Like</button>');
	},

	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;		
	}

	});

})(jQuery);

