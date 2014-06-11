var app = app || {};

(function ($) {
        'use strict';

	app.roundView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-8 col-md-offset-2" id="story">'+
					'<div id="storyText"><h3>{{story}}</h3></div>' +
					'<div id="input">' +
						'<input class="form-control" id="enter" type="text" name="enter_word" placeholder="Your turn to Fib!"></>' +
					'</div>' +
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('round view initialized with ');
			console.log(this.model);
			if(this.model.story == undefined || this.model.story == ''){
				app.AppView.vent.trigger('getCard', this.model.number);
			}
			
			//$('#storyTextt').append(this.model.story);
		},

		events: {
			'keypress #enter': 'submitWord'
		},

		submitWord: function(event){
			var word = jQuery('#enter').val();
			if (event.which == 32 || event.which == 13) {
				app.AppView.vent.trigger('sendWord', word);
			}
		},

		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}

	});

})(jQuery);