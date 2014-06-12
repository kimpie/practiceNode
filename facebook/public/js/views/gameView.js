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
						'<h3>{{round_turn}}\'s Round</h3>' +
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
		//app.AppView.vent.on('round', this.level, this);
		//Socket information
		var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
		socket.emit('room', {room: this.room});

//		this.board = this.$('#board');
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
		//'click .cards': 'level',
		'click #startRound': 'startRound',
		//'keypress #enter': 'submitWord',
		'click #share': 'share',
		'click #like': 'like'
	},

	showbtn: function(){
		$('#action').html('<button class="btn btn-success btn-block" id="startRound">Start</button>');
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

/*	level: function(info){
		console.log('level called with ' + info);
		var level;
		if (info == undefined){
			level = location.hash.split('/')[6];
		} else {
			level = info;
		}
        var rv = new app.roundView({model: this.model.attributes.round[level]});
        this.board.html(rv.render().el);
	},*/

	showCard: function(card){
			/*console.log(card);
			this.card = card;
			var cv = new app.cardView({model: card});
			this.board.html(cv.render().el);
			/*var story,
				arr = this.model.attributes.round;
			function getCard(element,index,array){
			    if (element.card == this.card.id){
			    	story = element.story;
			    }
			}
			arr.forEach(getCard);
			if(this.model.attributes.round.story != ''){
				console.log('story not started yet')
				$('#action').html('<button class="btn btn-success btn-block" id="startRound">Start</button>');
			} else {
				console.log('story started');
			}*/
	},

	saveRound: function(){
		console.log(this.card);
		var that = this;
		this.model.save({
			round: {
				card: this.card.id
				}
			}, {
				success:function(response){
					console.log('successfully saved round info:');
					console.log(response);
					var rid = response.attributes.round[0]._id;
					app.AppRouter.navigate(location.hash.slice(0,-5) + 'round/' + rid);
				}
		});

	},

	startRound: function(){
		var that = this,
			pid = location.hash.slice(10).split('/')[0],
			k = location.hash.substr(location.hash.length - 1, location.hash.length);
		app.AppView.vent.trigger('startRound', that.model.attributes.round[k]);
		if (this.live){
			this.count = 60;
		} else {
			this.count = 30;
		}
		var counter = setInterval(timer, 1000);
		$('#playerTurn, #action').empty();
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
		console.log(info);
		var word = info;
		this.count = 0;
		var that = this;
		if (that.live){
			console.log('game is live, not saving until end of round');
		} else {
			var	level = location.hash.slice(10).split('/')[4],
				k = that.model.attributes.round[level].story,
				pid = location.hash.slice(10).split('/')[0];
			var turn = that.model.rotateTurn({round_turn: false});
			console.log('submitWord received new turn for: ' + turn);
			console.log(turn != undefined && turn != '');
			if (turn != undefined && turn != ''){
				console.log('ready for socket emit');
				socket.emit('chat', {
					level: level,
					room: that.room,
					word: word,
					story: String(k + " " + word),
					playerId: pid,
					word_turn: turn,
					round_turn: that.model.attributes.round_turn,
					in_progress: true
				});
				$('#input').html('<input type="text" id="disabledTextInput" class="form-control" placeholder="Waiting for the next fib" disabled>');
			}
		}

	},

	sNs: function (info){
		console.log(info);	
		var notify = info.notify;
		if (info.room == this.room){
			var model = this.model;
			var that = this;
			model.saveData(info, {url: location.hash.slice(0, -6)},{
				success:function(){
					app.AppRouter.navigate(location.hash + '/round/' + info.level);
					app.AppView.vent.trigger('update');
					that.level(info.level);
				}
			});
			if(model.attributes.word_turn == name){
				$('#input').html('<input class="form-control" id="enter" type="text" name="enter_word" placeholder="Your turn to Fib!"></>')
			}
			//app.AppView.vent.trigger('playersTurn', info.turn, model);
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

