var app = app || {};

(function ($) {
        'use strict';

	app.cardView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
				'<div class="col-md-4 col-md-offset-4" id="cardTitle" style="display:none; text-align:center;"><h4>Round Rules</h4></div>' +
				'<div class="row" id="cardBody">'+
					'<div class="col-md-4 col-md-offset-4 cb darkBlue" id="cbtop">' +
						'<h4>{{direction}}</h4>' + 
					'</div>' +
					'<div class="col-md-4 col-md-offset-4 cb lightBlue" id="cbbottom">'+
						'<h4>Rule:{{rule}}</h4>' +
					'</div>' + 
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('card view initialized with ');
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
			var round = location.hash.slice(10).split('/')[4];
			app.AppView.vent.trigger('showTimerInfo', round);
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);