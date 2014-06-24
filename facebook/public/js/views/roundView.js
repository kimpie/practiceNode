var app = app || {};

(function ($) {
        'use strict';

	app.roundView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-8 col-md-offset-2" id="story">'+
					'<div id="storyText"><h3>{{story}}</h3></div>' +
				'<div class="col-md-12" id="textArea" style:"padding-left:0px; padding-right:0px;">'+
					'<div id="input" class="transparent-input">' +
					'</div>' +
				'</div>' +
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('round view initialized with ');
			console.log(this.model);
			this.room = location.hash.split('/')[4];
			//var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
			//socket.emit('room', {room: this.room});

			app.AppView.vent.on('update', this.render, this);
			app.AppView.vent.on('wordTurn', this.wt, this);
			
			//$('#storyTextt').append(this.model.story);
		},

		events: {
			'keypress #enter': 'submitWord'
		},

		wt: function(wt){
			if(wt == name){
				var round = this.model.number;
				app.AppView.vent.trigger('startTimer', round);
				$('#input').html('<input x-webkit-speech class="form-control" id="enter" type="text" name="enter_word" placeholder="Your turn to Fib!"></>');
			} else {
				$('#input').html('<input type="text" id="disabledTextInput" class="form-control" placeholder="Waiting for the next fib" disabled></>');
			}
		},

		submitWord: function(event){
			var word = jQuery('#enter').val();
			var that = this;
			if (event.which == 32 || event.which == 13) {
				var info = {
					word: word,
					room: that.room,
					level: that.model.number,
					playerId: location.hash.slice(10).split('/')[0]
				};
				console.log('sending word inside roundView');
				app.AppView.vent.trigger('sendGameData', info);
			}
		},

		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}

	});

})(jQuery);