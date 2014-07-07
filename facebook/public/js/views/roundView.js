var app = app || {};

(function ($) {
        'use strict';

	app.roundView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-12" id="timer" style="padding-right:0px; padding-left:0px;">'+
				'</div>' +
			'</div>' +
			'<div class="row">' +
				'<div class="col-md-12 darkBlue" id="story">'+
					'<div id="storyText"><h3>{{story}}</h3></div>' +
				'</div>' +
				'<div class="col-md-12" id="textArea" style:"padding-left:0px; padding-right:0px;">'+
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
			if (options.place == 'Live'){
				this.live == true;
			} else {
				this.live == false;
			}

			app.AppView.vent.on('update', this.render, this);
			app.AppView.vent.on('wordTurn', this.wt, this);

		},

		events: {
			'keypress #enter': 'submitWord'
		},

		wt: function(wt){
			if(wt == name){
				var round = this.model.number;
				this.startTimer();
				$('#input').html('<input x-webkit-speech class="form-control" id="enter" type="text" name="enter_word" placeholder="Your turn to Fib!"></>');
			} else {
				$('#input').html('<input type="text" id="disabledTextInput" class="form-control" placeholder="Waiting for the next fib" disabled></>');
			}
		},

		submitWord: function(event){
			this.word = jQuery('#enter').val(),
			var that = this;
			if (event.which == 32 || event.which == 13) {
				that.count = 0;
			}
		},

		startTimer: function(){
			console.log('timer triggered');
			var round = location.hash.split('/')[6];
			if (this.live){
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
				if(that.live){
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
			var that = this;
			if(this.word != undefined && this.word != ''){
				var info = {
					word: word,
					room: that.room,
					level: that.model.number,
					playerId: location.hash.slice(10).split('/')[0]
				};
				console.log('sending word inside roundView');
				app.AppView.vent.trigger('sendGameData', info);
			} else {
				console.log('word wasn\'t submitted on time, lose a turn');
				var info = {
					room: that.room,
					level: that.model.number,
					playerId: location.hash.slice(10).split('/')[0]
				};
				app.AppView.vent.trigger('sendGameData', info);
			}
		},

		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}

	});

})(jQuery);