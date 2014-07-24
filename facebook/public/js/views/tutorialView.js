var app = app || {};

(function ($) {
        'use strict';

	app.tutorialView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
				'<div class="col-md-12 darkOrangeTop tut" style="margin-top:20px;">'+
					'<h4>Welcome to fibs! The game of hilarious stories between friends!</h4>'+
				'</div>'+
				'<div class="col-md-12 lightOrange tut">'+
					'<h4>To begin, setup your game to play online or face-to-face</h4>'+
				'</div>'+
				'<div class="col-md-12 darkBlue tut">'+
					'<h4>with a group or one-on-one.</h4>'+
				'</div>'+
				'<div class="col-md-12 lightBlue tut">'+
					'<h4>Three timed rounds, five categories.</h4>'+
				'</div>'+
				'<div class="col-md-12 darkBlue tut">'+
					'<h4>Create the best fib by adding one word at a time</h4>'+
				'</div>'+
				'<div class="col-md-12 lightOrange tut" id="tvDone" style="border-bottom-right-radius: 10px; border-bottom-left-radius: 10px; cursor:pointer;">'+
					'<h4>GET STARTED</h4>'+
				'</div>'+
			'</div>'
		),

		initialize: function(){
			console.log('tutorialView initialized');
		},

		events: {
			'click #tvDone': 'done'
		},

		done: function(){
			console.log('calling tvDone for loginPlayers');
			var fl = false;
			app.AppView.vent.trigger('tvDone', fl);
		},

		render: function(){
			this.$el.html(this.template);
			return this;
		}

	});

})(jQuery);