var app = app || {};

(function ($) {
        'use strict';

	app.timerInfo = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-12" id="timerInfo">' +
					'<div class="row lightOrange" id="tiTop">' +
						'<div class="col-xs-12 col-md-6" id="round"></div>' +
						'<div class="col-xs-12 col-md-6" id="time" style="color:black;"></div>' +
					'</div>' +
					'<div class="row darkBlue">' +
						'<div class="col-xs-12 col-md-10 col-md-offset-1" id="countdown"></div>' +
					'</div>' +
					'<div class="row lightBlue" id="tiBottom">' +	
						'<div class="col-xs-12 col-md-10 col-md-offset-1" id="roundCard">' +
							'<h3>Round Rules</h3>' +
							'<div id="roundDir"></div>' +
							'<div id="roundRule"></div>' +
						'</div>' +
					'</div>' +	
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			console.log('timerInfo started with count of: ');
			console.log(options);
			var counter = setInterval(timer, 1000);
			var count = 6;
			var time = options.count;
			var round = location.hash.slice(10).split('/')[4];
			function timer() {
				$('#round').html('<h3>Round ' + round + '</h3>')
				$('#time').html('<h3>' + time + ' seconds</h3>');
				$('#roundDir').html('<h3><em>Inspiration</em>  ' + options.direction + '</h3>');
				$('#roundRule').html('<h3><em>Rule</em>  ' + options.rule + '</h3>');
				count=count-1;
				if (count <= 0) {
					clearInterval(counter);
					var game = location.hash.slice(10).split('/')[2];
					app.AppView.vent.trigger('startRound', game, round, time);
					return;
				}
				for(var i=0;i<count;i++){
                    $('#countdown').html('<h2>Start in ' + count + '</h2>');
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