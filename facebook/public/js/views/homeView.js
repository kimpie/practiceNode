var app = app || {};

(function ($) {
        'use strict';

	Handlebars.registerHelper('ifMyTurn', function(turn, options) {
		console.log(turn);
	  if(turn == name) {
	    return options.fn(this);
	  } else {
	  	return options.inverse(this);
	  }
	}),
    

	app.homeView = Backbone.View.extend({

		template: Handlebars.compile(
			'<section id="userName">' +
				'<div class="well well-lg">' +
					'<p class="lead">Play with a Group or One-on-One</p>' +
					'<button class="btn btn-primary btn-lg" id="btn-success">NEW GAME</button>' +
				'</div>' +
				'<section id="main">' +
					'<div id="games_yours">' +
						'<ul id="gamelist">' +
							'{{#each games}}' +
							'{{#ifMyTurn turn}}' +
								'<li id="player_name"><a class="btn btn-default btn-lg btn-block" id="indGame" href="{{url}}">Fib with {{#each players}}{{name }} {{/each}}</a></li>' +
							'{{else}}' +
								'<li id="player_name"><a class="btn btn-default btn-lg btn-block" disabled="disabled" id="indGame" href="{{url}}">Fib with {{#each players}}{{name }} {{/each}}</a></li>' +
							'{{/ifMyTurn}}' +
							'{{/each}}' +
						'</ul>' +
					'</div>' +
				'</section>' +
			'</section>' 
		),

		events: {
			'click #btn-success' : 'request'
		},

		initialize: function  (options) {
			console.log(options);
			this.model = options.model;
			console.log('homeView has been initialized with ' + this.model.id);
			this.model.bind('reset', this.render);			
			this.listenTo(this.model, "change", this.render);
			app.AppView.vent.on('updatehv', this.render, this);
		},

		request: function(){
			app.AppView.vent.trigger('requestGame');
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);