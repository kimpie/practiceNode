var app = app || {};

(function ($) {
        'use strict';

	app.homeView = Backbone.View.extend({

		template: Handlebars.compile(
			'<section id="userName">' +
				'<button type="button" class="btn btn-default btn-block" id="top_btn">Badges</button>' +
				'<div class="well well-lg">' +
					'<p class="lead">Start a new game either with a group or play one-on-one</p>' +
					'<button class="btn btn-primary btn-lg" id="btn-success">NEW GAME</button>' +
				'</div>' +
				'<section id="main">' +
					'<div id="games_yours">' +
						'<div style="text-align:center; background-color: 1c5f60; line-height: 3; color:white"><strong>YOUR TURN</strong></div>' +
							'<div class="panel-body" id="gmPanel">' +
								'<ul id="gamelist">' +
								'{{#each games}}' +
								'{{#if turn}}' +
								'<li id="player_name"><a class="btn btn-default btn-lg btn-block" id="indGame" href="{{url}}">Fib with {{player2_name}}</a></li>' +
								'{{/if}}' +
								'{{/each}}' +
								'</ul>' +
							'</div>' +
					'</div>' +
					'<div id="games_theirs">' +
						'<div style="text-align:center;  background-color: 1c5f60; line-height: 3; color:white">Their Turn</div>' +
							'<div class="panel-body" id="gmPanel">' +
								'<ul id="gamelist">' +
								'{{#each games}}' +
								'{{#unless turn}}' +
								'<li id="player_name"><a class="btn btn-default btn-lg btn-block" id="indGame" href="{{url}}">Fib with {{player2_name}}</a></li>' +
								'{{/unless}}' +
								'{{/each}}' +
								'</ul>' +
							'</div>' +
					'</div>' +
				'</section>' +
			'</section>' 
		),

		events: {
			'click #btn-success' : 'request',
			"click #indGame": "loadGame"
		},

		initialize: function  (options) {
			console.log(options);
			this.model = options.model;
			console.log('homeView has been initialized with ' + this.model.id);
			this.model.bind('reset', this.render);			
			this.listenTo(this.model, "change", this.render);
		},

		request: function(){
			app.AppView.vent.trigger('requestGame');
		},

		loadGame: function(info){
			console.log(info);
			//app.AppView.vent.trigger('gameView', game);
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));

			return this;
		}

	});

})(jQuery);