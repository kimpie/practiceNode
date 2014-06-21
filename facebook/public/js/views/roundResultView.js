var app = app || {};

(function ($) {
        'use strict';

	app.roundResultView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-8 col-md-offset-2" id="result">'+
					'<div><h3>Great Fib! This round is complete.</h3></div>' +
					'<div><h3>Share this fib with friends.</h3></div>'+
					'<div id="storyText"><h2>"{{story}}"</h2></div>' +
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('roundResultview initialized with ');
			console.log(this.model);
		},

		events: {
		},

		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}

	});

})(jQuery);