var app = app || {};

(function ($) {
        'use strict';

	app.timerInfo = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-12" id="timerInfo">' +
					'<div class="row lightOrange" id="ready">' +
						'<h2>ready?</h2>' +
					'</div>' +
					'<div class="row">' +	
						'<div class="col-xs-12 col-md-10 col-md-offset-1" id="round"></div>' +
						'<div class="col-xs-12 col-md-10 col-md-offset-1" id="roundCard">' +
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
			this.t = options.count;
			this.round = location.hash.slice(10).split('/')[4];
			if(this.round == '3'){
				var l = 'Final Round';
			} else {
				var l = 'Round ' + this.round;
			}
			var that = this;
			function timer() {
				$('#round').html('<h3>' + l + '</h3>')
				$('#time').html('<h3>You have ' + that.t + ' seconds to enter a word during this turn.</h3>');
				$('#roundDir').html('<h3><em>Topic</em>  ' + options.direction + '</h3>');
				$('#roundRule').html('<h3><em>Rule</em>  ' + options.rule + '</h3>');
				count=count-1;
				if (count <= 0) {
					clearInterval(counter);
					return;
				}
			}	
		},

		events: {
			'click #ready': "ready"
		},

		ready: function(){
			var game = location.hash.slice(10).split('/')[2];
			app.AppView.vent.trigger('startRound', game, this.round, this.t);
		},

		render: function () {
			this.$el.html(this.template);
			return this;
		}

	});

})(jQuery);