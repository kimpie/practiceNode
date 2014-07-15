var app = app || {};

(function ($) {
        'use strict';

	app.cardView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
				'<div class="col-md-6 col-md-offset-3 lightOrange cb"><h3>Got it. Lets fib!</h3></div>' +
			'</div>' +
			'<div class="row">'+
				'<div class="col-md-6 col-md-offset-3" id="cardTitle" style="display:none; text-align:center;"><h4>Round Rules</h4></div>' +
				'<div class="row" id="cardBody">'+
					'<div class="col-md-6 col-md-offset-3 darkBlue" id="cbtop">' +
						'<h4>Inspiration: {{direction}}</h4>' + 
					'</div>' +
					'<div class="col-md-6 col-md-offset-3 lightBlue" id="cbbottom">'+
						'<h4>Rule: {{rule}}</h4>' +
					'</div>' + 
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('card view initialized with ');
			console.log(this.model);
			var hash = location.hash.split('/');
		},

		events: {
			'click #cardTitle' : 'showHide',
			'click .cb' : 'startGame'
		},

		showHide: function(){
			if( $('div#cardBody').is(':hidden') ) {
				$('div#cardBody').show();
			} else {
				$('div#cardBody').hide();
			}
		},

		startGame: function(){
			if( $('#play').is(':hidden') ){
				var round = location.hash.slice(10).split('/')[4];
				var card = this.model;
				var game_model = location.hash.slice(10).split('/')[2];
				app.AppView.vent.trigger('showTimerInfo', game_model, round, card);
			} else {
				console.log('startGame won\'t launch because this.play is hidden');
				$('div#cardBody').hide();
			}
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);