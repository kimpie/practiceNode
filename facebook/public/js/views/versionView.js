var app = app || {};

(function ($) {
        'use strict';

	app.versionView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-8 col-md-offset-2">' +
					'<div class="well">' +
						'<h3>Are you playing this fib</h3>' +
						'<button type="button" class="btn btn-primary btn-lg btn-block" id="online">Online</button>' +
						'<h3>OR</h3>' +
						'<button type="button" class="btn btn-primary btn-lg btn-block" id="live">Live</button>' +
					'</div>' +
				'</div>' +
			'</div>'
		),


		events: {
			'click #online': 'online_game',
			'click #live': 'live_game'
		},

		initialize: function  (options) {
			//console.log(options);
			//this.model = options.model;
			console.log('versionView has been initialized');
			//this.listenTo(this.model, "change", this.render);
		},

		online_game: function(){
			console.log('starting an online game');
			app.AppView.vent.trigger('inviteFriends');
			//app.AppView.vent.trigger('onlineGame');
		},

		live_game: function(){
			console.log('starting a live game');
			app.AppView.vent.trigger('inviteFriends');
			//app.AppView.vent.trigger('liveGame');
		},


		render: function () {
			this.$el.html(this.template);

			return this;
		}

	});

})(jQuery);