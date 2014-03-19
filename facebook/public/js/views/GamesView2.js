var app = app || {};

(function ($) {

	app.GamesView2 = Backbone.View.extend({

		template2: Handlebars.compile(
		'<div id="waiting">' +
		'</div>' +
		'<div id="inGame1">' +
			'<h4> Game with {{player1_name}}</h4>' +
		'</div>'+
		'<div id="display_word">' +
		'</div>' +
		'<div id="turn">'+
		'</div>' +
		'<div id="input_area">' +
			'<input id="enter" type="text" name="enter_word" placeholder="enter a word..."></>' +
		'</div>' 
	),

		template3: Handlebars.compile(
		'<div id="inGame1">' +
			'<h4> Game with {{player1_name}}</h4>' +
		'</div>'+
		'<div id="test">'+
		'</div>' +

		'<div id="display_word">' +
		'</div>' +
		'<div id="disabled_input_area">' +
			'<input id="disabledInput" type="text" name="enter_word" placeholder="waiting for {{player1_name}}" disabled></>' +
		'</div>' 
		),

		template4: Handlebars.compile(
			'<h3>Congratulations, Sentence is Complete!</h3>' +
			'<div id="display_word">' +
			'</div>' +
			'<h3>Send the story to friends on facebook or email</h4>' +
			'<div class="fb-send" data-href="{{game_url}}" data-colorscheme="light"></div>'
		),

	initialize: function  (options) {
		console.log('GamesView2 initialized');
		this.model = options.model;
		this.model.bind("change", this.render, this);
		
		var o = String(this.model.attributes.player1);
		var p = String(this.model.attributes.player2);
		var q = o + p;
		var room = "abc123";
//		socket.on('connect', function(){
//			socket.emit('room', room);
//		});

		app.AppView.vent.on('saveNewSentence', this.sNs, this);

		this.turn = this.$('#turn');
		this.test = this.$('#test');
		this.sentence = this.$('#display_word');

		this.render();
	},

	events: {
		'keypress #enter': 'displayChange'
	},

	sNs: function (info){
		console.log(this.model);
		console.log('info from sns: ' + info);
		this.model.saveData(info);
	},

	displayChange: function (event){
		if (event.which == 32 || event.which == 13) {
			var word = jQuery('#enter').val();

			if (word == "." || word == "?" || word == "!") {
				var url = location.href;
				var end = confirm('Using punctuation will end the sentence. \nAre you sure you want to end the game with ' + "\'" + word + "\'");
				var allSentence = this.$("#display_word").text() + " " + end;
				if (end){
					this.model.endGame(allSentence, url);
				} 
			} else {
				console.log(word);
				var k = this.model.attributes.sentence;
				var o = String(this.model.attributes.player1);
				var p = String(this.model.attributes.player2);
				var q = o + p;
//				socket.emit('chat', {
					//room: q,
//					message: String(k + " " + word)
//				});
//				socket.emit('example', {test: 'supa-dupa'});

				var y = this.model.attributes.turn;
				app.AppView.vent.trigger('turn:update2', y);
				this.render();
			}	
//			var $turn = this.$('#input_area');
//			var $wait = this.$('#disabled_input_area');
//			$turn.css({'display' : 'none'});
//			$wait.css({'display': 'block'});
		}

	},

	render: function () {
		if ( this.model.get('turn') == Number(currentUser) ) {
			this.$el.html(this.template2(this.model.attributes));
			return this;
		} else {
			this.$el.html(this.template3(this.model.attributes));
			return this;
		}
		if (this.model.get('complete') == true){
			this.$el.html(this.template4(this.model.attributes));
			return this;	
		}
	}

	});

})(jQuery);