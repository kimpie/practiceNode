var app = app || {};

(function ($) {
        'use strict';

	app.VoteView = Backbone.View.extend({

		template: Handlebars.compile(
		/*	'<div class="row">' +
				'<div class="col-md-10 col-md-offset-1" id="intro">' +
					'<h2> The Game of Stories Between Friends </h2>' +
					'<p class="lead">Here\'s a sample sentence to get you going...</p>' +
				'</div>' +
			'</div>' +*/
			'<div class="row">'+
				'<div class="col-md-10 col-md-offset-1">' +
					'<h4>Recently completed sentences:</h4>' +
					'<div class="well" id="sample">' +
							'<h3>{{sentence}}</h3>' +
					'</div>' +
				'</div>' +
			'</div>'
			/*'<div class="row">' +
				'<div class="col-md-10 col-md-offset-1" id="rules">' +
				'<p class="lead">Playing the game is simple and only takes your imagination.</p>' +
				'<p> Start a New Game by inviting a friend to play.  Whoever starts the sentence sets the tone for the game by entering the first word.</p>' +
				'<p>The other player enters the next word and game continues going back and forth until someone ends the game with either a "." , "!" or "?"</p>' +
				'</div>' +
			'</div>'*/
		),

		events: {
		},

		initialize: function  (options) {
			console.log(options);
			this.model = options.model;
			console.log(this.model);
			console.log('VoteView has been initialized');

			app.AppView.vent.on('rotate', this.render, this);
			app.AppView.vent.trigger('startTimer');
			this.listenTo(this.model, "change", this.render);
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);