var app = app || {};

(function ($) {
        'use strict';

    Handlebars.registerHelper('ifNG', function(ng_request, options) {
		console.log(ng_request);
	  if(ng_request != undefined && ng_request != '') {
	    return options.fn(this);
	  } else {
	  	return options.inverse(this);
	  }
	}),

	Handlebars.registerHelper('ifWaiting', function(ng_request, options) {
		console.log(ng_request);
	  if(ng_request == name) {
	    return options.fn(this);
	  } else {
	  	return options.inverse(this);
	  }
	}),

	app.gameReview = Backbone.View.extend({

		template: Handlebars.compile(

			'<div class="row lightOrange" style="border-top:1px solid lightOrange; border-top-right-radius:10px; border-top-left-radius:10px;">' +
				'<div class="col-md-12" id="fibAgain">'+
					'<h2>Fib Again</h2>' +
				'</div>' +
			'</div>' +
			'<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
			  '<div class="modal-dialog" style="margin-top:60px;">' +
			    '<div class="modal-content">' +
			      '<div class="modal-body lightblue" style="border-top: .5px solid lightblue ; border-top-right-radius:5px;border-top-left-radius:5px;">' +
			        '<h3>Starting a new game with the same fibbers will delete this game.   </h3>' +
			        '<p class="lead"><em>If you want to share this game first, hit cancel to go back.</em></p>' +
			        '<h3>Is that okay?</h3>' +
			      '</div>' +
			      '<div class="modal-footer row" style="margin:0; padding:0;">' +
			        '<div class="col-md-6" data-dismiss="modal" style="cursor: pointer;  text-align:center; padding-top:20px; padding-bottom:20px;">Cancel</div>' +
			        '<div class="col-md-6 lightOrange delete" id="playAgain" style="cursor: pointer;  border-bottom: .5px solid lightOrange; border-bottom-right-radius:5px;padding-top:20px; padding-bottom:20px;" data-dismiss="modal">Okay</div>' +
			      '</div>' +
			    '</div>' +
			  '</div>' +
			'</div>' +

			'<div class="modal fade" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel2" aria-hidden="true">' +
			  '<div class="modal-dialog" style="margin-top:60px;">' +
			    '<div class="modal-content">' +
			      '<div class="modal-body lightblue" style="border-top: .5px solid lightblue ; border-top-right-radius:5px;border-top-left-radius:5px;">' +
			        '<h3>Are you sure you want to delete this game?</h3>' +
			        '<p class="lead"><em>If you want to share this game first, hit cancel to go back.</em></p>' +
			      '</div>' +
			      '<div class="modal-footer row" style="margin:0; padding:0;">' +
			        '<div class="col-md-6" data-dismiss="modal" style="cursor: pointer;  text-align:center; padding-top:20px; padding-bottom:20px;">Cancel</div>' +
			        '<div class="col-md-6 lightOrange delete" id="deletebtn" style="cursor: pointer;  border-bottom: .5px solid lightOrange; border-bottom-right-radius:5px;padding-top:20px; padding-bottom:20px;" data-dismiss="modal">Delete</div>' +
			      '</div>' +
			    '</div>' +
			  '</div>' +
			'</div>' +

			'{{#each round}}'+
				'<div class="row" id="round{{number}}review">' +
					'<div class="col-md-12">' +
							'<h3>Round {{number}} Result</h3>' +
							'<h3>"{{story}}"</h3>'+						
					'</div>' +
				'</div>' +
			'{{/each}}'+
			'{{#ifWaiting ng_request}}'+
			'{{else}}'+
				'<div class="row">' +
					'<div class="col-md-12" style="padding-top:10px; cursor:pointer;">'+
						'<p class="lead" data-toggle="modal" data-target="#myModal2" id="notPlayAgain">Not playing again? Delete Game.</p>' +
					'</div>' +
				'<div>'+
			'{{/ifWaiting}}'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('gameReview initialized with ');
			console.log(this.model);
		},

		events: {
			'click #fibAgain' : 'startNew',
			'click .delete' : 'endGame'
		},

		startNew: function(){
			console.log('would start new game with this model info');
			app.AppView.vent.trigger('requestGame');
		},

		endGame: function(){
			console.log('ending game');
			var stage = 'removed';
			var p = undefined;
			app.AppView.vent.trigger('removeGame', this.model, p, stage);
			var info={
				stage: stage,
				room: this.model.id,
				playerId: location.hash.slice(10).split('/')[0],
				close: true
			};
			app.AppView.vent.trigger('ab', info);		
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);