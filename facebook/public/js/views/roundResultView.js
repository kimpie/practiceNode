var app = app || {};

(function ($) {
        'use strict';

	app.roundResultView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
				'<div class="col-md-12 lightOrange" id="done"><h3>Fib Review Finished</h3></div>' +
			'</div>' +
			'<div class="row">' +
				'<div class="col-md-12 darkBlue" id="result">'+
					'<div style="color:	#333399;"><h3>Great Fib! This round is complete.</h3></div>' +
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
			'click #done' : 'send'
		},

		send: function(){
			console.log('send called');
			app.AppView.vent.trigger('ab');
		},

		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}

	});

})(jQuery);