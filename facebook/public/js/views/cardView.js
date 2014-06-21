var app = app || {};

(function ($) {
        'use strict';

	app.cardView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
				'<div class="col-md-8 col-md-offset-2" id="cardTitle" style="display:none; text-align:center;"><h4>Round Rules</h4></div>' +
				'<div class="col-md-8 col-md-offset-2" id="cardBody">'+
				'<em style="text-align:center;">Read the card, then hit the START button above.</em>'+
					'<div class="row">'+
						'<div class="col-md-8 col-md-offset-2" style="text-align:left;"><h4>Direction:</h4></div>' + 
						'<div class="col-md-8 col-md-offset-2" style="text-align:center;"><p class="lead">{{direction}}</p></div>' +
						'<div class="col-md-8 col-md-offset-2" style="text-align:left;"><h4>Rule:</h4></div>' + 
						'<div class="col-md-8 col-md-offset-2" style="text-align:center;"><p class="lead">{{rule}}</p></div>' +
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
			'click #cardTitle': 'showHide'
		},

		showHide: function(){
			if( $('div#cardBody').is(':hidden') ) {
				$('div#cardBody').show();
			} else {
				$('div#cardBody').hide();
			}
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);