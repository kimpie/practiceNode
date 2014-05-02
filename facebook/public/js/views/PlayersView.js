var app = app || {};

(function ($) {
        'use strict';

	app.PlayersView = Backbone.View.extend({

		template: Handlebars.compile(
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
			'</div>'
		),


		events: {
			"click #indGame": "loadGame"
		},

		initialize: function  (options) {
			console.log(options);
			this.model = options.model;
			var i = this.model.attributes.games.length;
			console.log('PlayersView has been initialized with ' + i + ' games');
			this.model.bind('reset', this.render);			
			this.listenTo(this.model, "change", this.notice);
			this.listenTo(this.model, "change", this.render);
			//app.AppView.vent.on('saveNewSentence', this.newTurn, this);
		},

		newTurn: function(info){
			console.log('newTurn triggered with info:');
			console.log(info);
			var player = this.model;
			var game = info.game;
			if (info.turn == Number(currentUser)){
				console.log('PlayersView says its my turn for fb_id ' + player.attributes.fb_id);
				player.turn(player, game);
			} else {
				console.log('PlayersView says its not my turn for fb_id ' + player.attributes.fb_id);
				player.noturn(player, game);
			}
		},

		loadGame: function(data){
			//need to route to the page with the game id associated with player2
			console.log('loadGame triggered on PlayersView');
		},


		alertPlayer: function(info){
			console.log('alertPlayer triggered with ' + info);
			if (info == Number(currentUser)){
				var $turn = this.$('#player_name');
				$turn.css({'background-color': 'yellow'});
			}
			
		},

		notice: function (){
			console.log('Something on the model has changed.');
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));

			return this;
		}

	});

})(jQuery);