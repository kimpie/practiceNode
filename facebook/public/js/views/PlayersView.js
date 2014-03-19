var app = app || {};

(function ($) {
        'use strict';

	app.PlayersView = Backbone.View.extend({

		template: Handlebars.compile(
			
			'<h3>Welcome {{name}}</h3>' +
			'<div id="games" class="panel panel-default">' +
				'<div class="panel-heading" >Your games</div>' +
				'<div class="panel-body">' +
					'<ul>' +
					'{{#each games}}' +
					'<li id="player_name"><a class="btn btn-default btn-lg btn-block" id="indGame" href="{{url}}">{{player2_name}}</a></li>' +
					'{{/each}}' +
					'</ul>' +
				'</div>'+
			'</div>'
		),

		events: {
			"click #indGame": "loadGame"
		},

		initialize: function  (options) {
			var i = this.model.attributes.games.length;
			console.log('PlayersView has been initialized with ' + i + ' games');
			this.model = options.model;
			this.model.bind('reset', this.render);

			app.AppView.vent.on('turn:update', this.alertPlayer);
			
			this.listenTo(this.model, "change", this.notice);
			this.listenTo(this.model, "change", this.render);
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