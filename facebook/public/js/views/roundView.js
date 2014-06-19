var app = app || {};

(function ($) {
        'use strict';

    Handlebars.registerHelper('ifWT', function(wt, options) {
		console.log(wt);
	  if(wt == name) {
	    return options.fn(this);
	    console.log(name + ' it\'s your turn');
	  } else {
	  	console.log(name + ' it\'s not your turn');
	  	return options.inverse(this);
	  }
	}),

	app.roundView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-8 col-md-offset-2" id="story">'+
					'<div id="storyText"><h3>{{story}}</h3></div>' +
					'<div id="input">' +
						/*'{{#ifWT word_turn}}'+
							'<input class="form-control" id="enter" type="text" name="enter_word" placeholder="Your turn to Fib!"></>' +
						'{{else}}'+
							'<input type="text" id="disabledTextInput" class="form-control" placeholder="Waiting for the next fib" disabled></>' +
						'{{/ifWT}}' +*/
					'</div>' +
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('round view initialized with ');
			console.log(this.model);
			this.room = location.hash.split('/')[4];
			var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
			socket.emit('room', {room: this.room});

			app.AppView.vent.on('update', this.render, this);
			app.AppView.vent.on('wordTurn', this.wt, this);
			
			//$('#storyTextt').append(this.model.story);
		},

		events: {
			'keypress #enter': 'submitWord'
		},

		wt: function(wt){
			if(wt == name){
				app.AppView.vent.trigger('startTimer');
				$('#input').html('<input class="form-control" id="enter" type="text" name="enter_word" placeholder="Your turn to Fib!"></>');
			} else {
				$('#input').html('<input type="text" id="disabledTextInput" class="form-control" placeholder="Waiting for the next fib" disabled></>');
			}
		},

		submitWord: function(event){
			var word = jQuery('#enter').val();
			console.log(' ROUNDvIEW has word: ' + word + ' and room: ' + this.room);
			var that = this;
			if (event.which == 32 || event.which == 13) {
				var info = {
					word: word,
					room: that.room
				};
				app.AppView.vent.trigger('sendWord', info);
			}
		},

		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}

	});

})(jQuery);