var app = app || {};

(function ($) {
        'use strict';

	app.roundView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-12" id="timer">'+
				'</div>' +
			'</div>' +
			'<div class="row">' +
				'<div class="col-md-12 darkBlue" id="story">'+
					'<div id="storyText"><h3>{{story}}</h3></div>' +
				'</div>' +
				'<div class="col-md-12" id="textArea">'+
					'<div id="input" class="transparent-input" style="background-color: #FFC858; color: #359999">' +
					'</div>' +
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('round view initialized with ');
			console.log(this.model);
			this.room = location.hash.split('/')[4];
			this.place = options.place;
			var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
			socket.emit('room', {room: this.room});
			app.AppView.vent.on('update', this.render, this);
			app.AppView.vent.on('wordTurn', this.wt, this);
		},

		events: {
			'click #enter': 'speech',
			'keypress #enter': 'submitWord'
		},

		wt: function(wt){
			if(wt == name){
				var round = this.model.number;
				this.startTimer();
				if(this.place == 'Live'){
					var input = '<h3 id="enter" class="lightOrange talk">Press to Talk</h3>';
				} else {
					var input = '<input type="text" x-webkit-speech class="form-control" id="enter" name="enter_word" placeholder="Your turn to fib"></>';
				}
				$('#input').html(input);
			} else {
				var text = 'Waiting for next fib'
				$('#input').html('<input type="text" id="disabledTextInput" class="form-control" placeholder='+ text + ' disabled></>');
			}
		},

		speech: function(){
			var that = this;
			console.log('speech fn fired');
			var recognition = new webkitSpeechRecognition();
			recognition.lang = "en-US";
			recognition.onresult = function(event) { 
			  console.log(event.results[0][0].transcript); 
			  that.speech = event.results[0][0].transcript;
			  that.submitWord(that.speech);
			}
			$('#enter').bind('touchstart', function(){
				console.log('mousedown');
				$('#enter').attr('class', 'lightBlue');
				recognition.start();
			});
			$('#enter').bind('touchend', function(){
				console.log('mouseup');
				$('#enter').attr('class', 'lightOrange');
				recognition.stop();
			});
		},

		submitWord: function(event){
			var that = this;
			console.log(typeof event == "string");
			if (typeof event == "string" || event.which == 32 || event.which == 13) {
				if(that.place == 'Live'){
					if(typeof event == "string"){
						that.word = event;
					} else {
						that.word = jQuery('#enter').val();	
					}
					console.log('live game with word ' + that.word);
					socket.emit('chat',{
						word: that.word,
						room: that.room,
						level: that.model.number,
						playerId: location.hash.slice(10).split('/')[0],
						place: 'Live'
					});
					jQuery('#enter').val('');
				} else {
					console.log('game online');
					that.word = jQuery('#enter').val();
					that.count = 0;
				}
			}				


		},

		startTimer: function(){
			console.log('timer triggered');
			var round = location.hash.split('/')[6];
			if (this.place == 'Live'){
				this.count = 60;
			} else {
				if(round == 1){
					this.count = 20;
				}else if(round == 2){
					this.count = 15;
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
					that.endOfTimer();
					return;
				}
				if(that.place == 'Live'){
					$('#timer').progressbar({
						max: 60,
						value: that.count
					});
				} else {
					if(round == 1){
						$('#timer').progressbar({
							max: 20,
							value: that.count
						});
					}else if(round == 2){
						$('#timer').progressbar({
							max: 15,
							value: that.count
						});
					}else{
						$('#timer').progressbar({
							max: 10,
							value: that.count
						});
					}	
				}
			}
		},

		endOfTimer: function(){
			console.log('endOfTimer called');
			var that = this;
			if(this.place == 'Live'){
				that.word = jQuery('#storyText').text();
				socket.emit('chat', {
						word: that.word,
						room: that.room,
						level: that.model.number,
						playerId: location.hash.slice(10).split('/')[0],
						place: 'Live',
						round: 'complete'
				});
			} else {
				if(this.word != undefined && this.word != ''){
					socket.emit('chat', {
						word: that.word,
						room: that.room,
						level: that.model.number,
						playerId: location.hash.slice(10).split('/')[0]
					});
				} else {
					socket.emit('chat', {
						room: that.room,
						level: that.model.number,
						playerId: location.hash.slice(10).split('/')[0]
					})
				}
			}
		},

		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}

	});

})(jQuery);