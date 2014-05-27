var app = app || {};

(function ($) {
        'use strict';

	app.cardView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="well" id="card">'+
				'<div class="col-md-10 col-md-offset-1">Direction</div>' + 
				'<div class="col-md-10 col-md-offset-1"> {{direction}} </div>' +
				'<div class="col-md-10 col-md-offset-1">Rule</div>' + 
				'<div class="col-md-10 col-md-offset-1">{{rule}} </div>' +
			'</div>' 
		),

		initialize: function  (options) {
			this.model = options.model;
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);