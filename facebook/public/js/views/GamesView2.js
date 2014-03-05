var app = app || {};

(function ($) {

	app.GamesView2 = Backbone.View.extend({

		template2: Handlebars.compile(

		'<div id="inGame1">' +
			'<h4> Game with {{player2_name}}</h4>' +
		'</div>'+

		'<div id="display_word">' +
			'{{sentence}}' +
		'</div>' +
		'<div id="turn">'+
		'</div>' +
		'<div id="input_area">' +
			'<input id="enter" type="text" name="enter_word" placeholder="enter a word..."></>' +
		'</div>' +
		'<div id="disabled_input_area">' +
			'<input id="disabledInput" type="text" name="enter_word" placeholder="waiting for {{player2_name}}" disabled></>' +
		'</div>' 
	),

	initialize: function  () {
		console.log('GamesView initialized');
		this.listenTo(this.model, "change", this.render);
		this.turn = this.$('#turn');
		this.render();
		this.model.turn;
	},

	events: {
		'keypress #enter': 'display',
		'click #turn': 'show'
	},

	show: function(){
		console.log('showing your turn');
		this.turn.html('Your Turn');
	},

	display: function (event){
		if (event.which == 32 || event.which == 13) {
			var word = jQuery('#enter').val();

			if (word == "." || word == "?" || word == "!") {
				console.log('Are you sure you want to end the senentence with: ' + word);
			} else {
				console.log(word);
				this.model.saveData(word);
				
			}	
			event.preventDefault();
			var $turn = this.$('#input_area');
			var $wait = this.$('#disabled_input_area');
			$turn.css({'display' : 'none'});
			$wait.css({'display': 'block'});
		}

	},

	render: function () {
		if (this.model.attributes.turn == Number(currentUser)){
			this.$el.html(this.template2(this.model.attributes));
			return this;
		} else {
			this.$el.html(this.template3(this.model.attributes));
			return this;
		}
	}

	});

})(jQuery);