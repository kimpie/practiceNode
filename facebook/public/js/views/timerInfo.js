var app = app || {};

(function ($) {
        'use strict';

	app.timerInfo = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-6 col-md-offset-3 lightOrange" id="timerInfo">'+
					'<h2>Get ready!</h2>'+
					'<div id="timercounter"></div>'+
					'<div id="countdown"></div>' +
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			console.log('timerInfo started with count of: ');
			console.log(options);
			var counter = setInterval(timer, 1000);
			var count = 4;
			function timer() {
				$('#timercounter').html('<h2>You have ' + options.count + ' seconds to enter a word.</h2>');
				count=count-1;
				if (count <= 0) {
					clearInterval(counter);
					var round = location.hash.slice(10).split('/')[4];
					var game = location.hash.slice(10).split('/')[2];
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