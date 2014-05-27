var app = app || {};

(function ($) {
        'use strict';

	app.rulesView = Backbone.View.extend({

		template: Handlebars.compile(
			
			'<div class="row">' +
				'<div class="col-md-10 col-md-offset-1" id="intro">'+
					'<h3 style="text-align: center">Welcome to MadFibs, {{name}}!</h3>' +
				//'</div>' +
			//'</div>' +
			//'<div class="row">' +
				//'<div class="col-md-10 col-md-offset-1" id="intro">' +
					'<h3> Sheep Count: <strong>{{points}}</strong> </h3>' +
					'<h3> Save your sheep from the wolf by beating the timer!</h3>' +
					'<h3> Start a new game now!</h3>' +
				//'</div>' +
			//'</div>' +
			//'<div class="row">' +
			//	'<div class="col-md-10 col-md-offset-1">' +
					'<button type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#myModal">How to Play</button>' +
					'<button type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#myModal2">Earn Points</button>' +
				'</div>' +
			'</div>' +

			'<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
			  '<div class="modal-dialog">' +
			    '<div class="modal-content">' +
			      '<div class="modal-header">' +
			        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
			        '<h4 class="modal-title" id="myModalLabel">How to Play</h4>' +
			      '</div>' +
			      '<div class="modal-body">' +
				      	'<h3> The Game of Stories Between Friends </h3>' +
				      	'<p class="lead"> Playing the game is simple and only takes your imagination.</p>' +
						'<p> Start a new game by inviting a friend to play.  Whoever starts the sentence sets the tone for the game by entering the first word.</p>' +
						'<p>The other player enters the next word and game continues going back and forth until someone ends the game with either a "." , "!" or "?"</p>' +
						'<p>Create the greatest fib ever or a hilarious story. The better your story is the more points you\'ll earn. Earn points individually and together. ' +

						'<p>Watch out, theres a wolf sneaking around stealing sheep. The more points you earn the more sheep you save from the big bad wolf.' + 
					'</div>' +			      
			    '</div>' +
			  '</div>' +
			'</div>' +
			'<div class="modal fade" id="myModal2" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
			  '<div class="modal-dialog">' +
			    '<div class="modal-content">' +
			      '<div class="modal-header">' +
			        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
			        '<h4 class="modal-title" id="myModalLabel">Earn Points</h4>' +
			      '</div>' +
			      '<div class="modal-body">' +
						'<h4>Player Points</h4>'+
						'<ul>'+
						'<li>Word with 0-3 letters:<class="text-primary"> 10 points</class="text-primary"></li>'+
						'<li>Word with 4-5 letters:<class="text-primary"> 15 points</class="text-primary"> </li>'+
						'<li>Word with 6-7 letters:<class="text-primary"> 25 points</class="text-primary"></li>' +
						'<li>Word with 8-9 letters:<class="text-primary"> 40 points</class="text-primary"></li>' +
						'<li>Word with 10+ letters:<class="text-primary"> 50 points</class="text-primary"></li>' +
						'</ul>' +
						'<p><b>Game Points</b></p>' +
						'<ul>' +
						'<li>Sentence with 10-15 words:<class="text-primary"> 20 points</class="text-primary"></li>' +
						'<li>Sentence with 16-20 words:<class="text-primary"> 40 points</class="text-primary"></li>'+
						'<li>Sentence with 21+ words:<class="text-primary"> 60 points</class="text-primary"></li>'+
						'</ul>'+
						'</div>' +
			      '</div>' +
			      
			    '</div>' +
			  '</div>' +
			'</div>'
		),


		events: {
		},

		initialize: function  (options) {
			console.log(options);
			this.model = options.model;
			console.log('homeView has been initialized with ' + this.model.id);
			this.listenTo(this.model, "change", this.render);
		},


		render: function () {
			this.$el.html(this.template(this.model.attributes));

			return this;
		}

	});

})(jQuery);