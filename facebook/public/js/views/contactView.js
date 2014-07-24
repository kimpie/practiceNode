var app = app || {};

(function ($) {
        'use strict';

	app.contactView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">' +
				'<div class="col-md-10 col-md-offset-1">' +
				'<h3>We\'d love to hear from you</h3>' +
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col-md-10 col-md-offset-1">'+
					'<form role="form">' +
					  '<div class="form-group">' +
					    '<label for="Name">Name <em>(as appears on Facebook)</em></label>' +
					    '<input type="name" class="form-control" id="name" placeholder="Enter name">' +
					  '</div>' +
					 '<div class="form-group">' +
					    '<label for="comments">Comments/Questions</label>' +
					    '<textarea class="form-control" rows="3" id="comment" placeholder="Enter comments or questions."></textarea>' +
					  '</div>' +
					  '<button type="submit" class="btn btn-default" id="submit">Submit</button>' +
					'</form>' +
				'</div>'+
			'</div>'


		),

		initialize: function  (options) {
			this.model = options.model;
		},

		events: {
			"click #submit" : "sendForm"
		},

		sendForm: function(e){
			e.preventDefault();
			var n = jQuery('#name').val();
			var c = jQuery('#comment').val();
			var info = {
				name: n,
				comments: c,
				player_id: Number(currentUser)
			};
			app.AppView.vent.trigger('sendContact', info);
		},


		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);