var app = app || {};

(function ($) {
        'use strict';

	app.roundResultView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-8 col-md-offset-2" id="story">'+
					'<div><h3>Great Fib! This round is complete.</h3></div>' +
					'<div><em>Share this fib with friends.  When finished hit the complete button above.</em></div>'+
					'<div id="storyText"><h3>{{story}}</h3></div>' +
				'</div>' +
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('roundResultview initialized with ');
			console.log(this.model);
			//if(this.model.story == undefined || this.model.story == ''){
			//	app.AppView.vent.trigger('getCard', this.model.number);
			//}
			
			//$('#storyTextt').append(this.model.story);
		},

		events: {
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);