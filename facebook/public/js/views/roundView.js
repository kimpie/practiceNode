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
						'{{#ifWT word_turn}}'+
							'<input class="form-control" id="enter" type="text" name="enter_word" placeholder="Your turn to Fib!"></>' +
						'{{else}}'+
							'<input type="text" id="disabledTextInput" class="form-control" placeholder="Waiting for the next fib" disabled></>' +
						'{{/ifWT}}' +
					'</div>' +
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('round view initialized with ');
			console.log(this.model);
			app.AppView.vent.on('update', this.render);
			
			//$('#storyTextt').append(this.model.story);
		},

		events: {
			'keypress #enter': 'submitWord'
		},

		submitWord: function(event){
			var word = jQuery('#enter').val();
			console.log(word);
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