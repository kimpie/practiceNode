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
	Handlebars.registerHelper('ifOnline', function(place, options) {
		console.log(place);
	  if(place == 'Online') {
	    return options.fn(this);
	  } 
	}),

	app.gameView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row top_gv darkOrangeTop">' +
				'<div class="col-md-12" style="margin: 5px 0 5px 0;">'+
					'{{#ifOnline place}}' +
						'<div class=" col-xs-12 col-md-3 col-md-offset-2" id="word_countdown">' + 
							'{{word_countdown}} Words Remaining' +
						'</div>' +
					'{{/ifOnline}}' +
					'<div class="col-xs-12 col-md-7" id="playerList">'+
						'<ul>'+
						'{{#each players}}' +
							'<li id="players" class="{{firstName name}}">{{name}}</li>'+
						'{{/each}}'+
						'{{#ifLive place}}' +
							'<li id="players"><a id="addPlayer"><span class="glyphicon glyphicon-plus"></span></a></li>' +
						'{{/ifLive}}'+
						'</ul>'+ 
					'</div>'+
				'</div>' +
			'</div>'
		),

	initialize: function  (options) {
		console.log('gameView triggered with options: ');
		console.log(options);
		this.model = options.model;
		this.room = options.model.id;
		//this.model.saveRound();
		this.model.bind("change", this.render, this);
		this.model.bind("reset", this.render);
		app.AppView.vent.on('showCard', this.showCard, this);
		app.AppView.vent.on('startBtn', this.showbtn, this);
		app.AppView.vent.once('sendWord', this.endOfTimer, this);
		//app.AppView.vent.on('saveNewSentence', this.sNs, this);
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
		$('#playerTurn').html('<h3 id="playAgain">Game Over.  Play again?</h3>');
		$('#playerTurn').attr('class', 'row lightOrange');
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
		$('#word_countdown').hide();
		var level = location.hash.split('/')[6];
		if(this.model.attributes.round[level - 1].complete || this.model.attributes.round[level - 1].review){
			$('#playerTurn').html('<a href="' + location.hash.substr(0, location.hash.length - 17) + '">Back to Game</a>');
			$('#playerTurn').attr('class', 'row lightOrange');
		} else if (this.model.attributes.round_turn == name){
			$('#playerTurn').attr('class', 'row lightOrange');
			$('#playerTurn').html('<h3 class="closeRound" id="gameView">Begin Next Round</h3>');
		} else {
			$('#playerTurn').attr('class', 'row lightOrange');
			$('#playerTurn').html('<h3 class="closeRound" id="home">Take me home, waiting for {{round_turn}} to begin next round</h3>');
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
	},

	showbtn: function(){
		if (this.model.attributes.round_turn == name){
			$('#playerTurn').html('<h3 id="startRound">Start Round</h3>');
			$('#playerTurn').attr('class', 'row lightOrange');
		} 
	},

	inRound: function(level){
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
				$('#playerTurn').progressbar({
					max: 60,
					value: that.count
				});
			} else {
				if(round == 1){
					$('#playerTurn').progressbar({
						max: 30,
						value: that.count
					});
				}else if(round == 2){
					$('#playerTurn').progressbar({
						max: 20,
						value: that.count
					});
				}else{
					$('#playerTurn').progressbar({
						max: 10,
						value: that.count
					});
				}
				
			}

		}	
	},

	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;		
	}

	});

})(jQuery);

