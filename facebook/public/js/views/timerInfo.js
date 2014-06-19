var app = app || {};

(function ($) {
        'use strict';

	app.timerInfo = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-8 col-md-offset-2" id="timerInfo">'+
					'<h2>You have 30 seconds to enter a word.</h2>' +
					'<h2>Get ready!</h2>'+
					'<div id="countdown"></div>' +
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			console.log('timerInfo started');
			var counter = setInterval(timer, 1000);
			var count = 4;
			function timer() {
				count=count-1;
				if (count <= 0) {
					clearInterval(counter);
					console.log('counter ended');
					var round = location.hash.slice(10).split('/')[4];
					var game = location.hash.slice(10).split('/')[2];
					console.log(round + ' ' + game);
					app.AppView.vent.trigger('startRound', game, round);
					return;
				}
				for(var i=0;i<count;i++){
                    $('#countdown').html('<h1>' + count + '</h1>');
                }
			}	
		},

		events: {
		},

		render: function () {
			this.$el.html(this.template);
			return this;
		}

	});

})(jQuery);