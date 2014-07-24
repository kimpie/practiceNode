var app = app || {};

(function ($) {
        'use strict';

	app.roundResultView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
				'<div class="col-md-12 lightOrange" id="done"><h3>Fib Review Finished</h3></div>' +
			'</div>' +
			'<div class="row">' +
				'<div class="col-md-12 darkOrange" id="share" style="cursor:pointer;"><h3>Share</h3></div>'+
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
			/*var title = "og:title";
			var val = 'Check out our fib!'
			app.AppView.vent.trigger('changeMeta', title, val);
			var desc = "og:description";
			var val2 = $('#storyText').text();
			app.AppView.vent.trigger('changeMeta', desc, val2);*/
		},

		events: {
			'click #done' : 'send',
			'click #share': 'share'
		},

		send: function(){
			console.log('send called');
			var info = {
				room: location.hash.split('/')[4]
			};
			app.AppView.vent.trigger('ab', info);
		},

		share: function(){
			FB.ui({
			  method: 'share',
			  href:'https://apps.facebook.com/playfibs/'
			}, function(response){});
		},

		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}

	});

})(jQuery);