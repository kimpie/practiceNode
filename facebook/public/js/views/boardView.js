var app = app || {};

(function ($) {
        'use strict';

    Handlebars.registerHelper('ifComplete', function(complete, options) {
	  if(complete) {
	    return options.fn(this);
	  } else {
	  	return options.inverse(this);
	  }
	}),

    Handlebars.registerHelper('ifRT', function(round_turn, options) {
    	console.log(round_turn);
	  if(round_turn == name) {
	    return options.fn(this);
	  } else {
	  	return options.inverse(this);
	  }
	}),


	app.boardView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
				'<ul id="cardList">'+
				'{{#ifRT round_turn}}'+
					'{{#each round}}'+
						'{{#if level_one}}'+
							'{{#ifComplete complete}}' +
								'<li id="1" class="col-xs-3 col-md-2 cards complete"><a href="{{url}}">Complete</a></li>'+
							'{{else}}'+
								'<li id="1" class="col-xs-3 col-md-2 cards"><a href="{{url}}">Level 1</a></li>'+
							'{{/ifComplete}}' +
						'{{/if}}'+
					'{{/each}}' +
				'{{else}}' +
					'{{#each round}}'+
						'{{#if level_one}}'+
								'{{#ifComplete complete}}' +
									'<li id="1" class="col-xs-3 col-md-2 cards complete"><a href="{{url}}">Complete</a></li>'+
								'{{else}}'+
									'<li id="1" class="col-xs-3 col-md-2 cards" style="color:gray;cursor:default;">Level 1</li>'+
								'{{/ifComplete}}' +
							'{{/if}}'+
					'{{/each}}' +
				'{{/ifRT}}' +
				'{{#ifRT round_turn}}'+
					'{{#each round}}'+
						'{{#if level_two}}'+
							'{{#ifComplete complete}}' +
								'<li id="2" class="col-xs-3 col-md-2 cards complete"><a href="{{url}}">Complete</a></li>'+
							'{{else}}'+
								'<li id="2" class="col-xs-3 col-md-2 cards"><a href="{{url}}">Level 2</a></li>'+
							'{{/ifComplete}}' +
						'{{/if}}'+
					'{{/each}}' +
				'{{else}}' +
					'{{#each round}}'+
						'{{#if level_two}}'+
							'{{#ifComplete complete}}' +
								'<li id="2" class="col-xs-3 col-md-2 cards complete"><a href="{{url}}">Complete</a></li>'+
							'{{else}}'+
								'<li id="2" class="col-xs-3 col-md-2 cards" style="color:gray;cursor:default;">Level 2</li>'+
							'{{/ifComplete}}' +
						'{{/if}}'+
					'{{/each}}' +
				'{{/ifRT}}' +
				'{{#ifRT round_turn}}'+
					'{{#each round}}'+
						'{{#if level_three}}'+
							'{{#ifComplete complete}}' +
								'<li id="3" class="col-xs-3 col-md-2 cards complete"><a href="{{url}}">Complete</a></li>'+
							'{{else}}'+
								'<li id="3" class="col-xs-3 col-md-2 cards"><a href="{{url}}">Level 3</a></li>'+
							'{{/ifComplete}}' +
						'{{/if}}'+
					'{{/each}}' +
				'{{else}}' +
					'{{#each round}}'+
						'{{#if level_three}}'+
							'{{#ifComplete complete}}' +
								'<li id="3" class="col-xs-3 col-md-2 cards complete"><a href="{{url}}">Complete</a></li>'+
							'{{else}}'+
								'<li id="3" class="col-xs-3 col-md-2 cards" style="color:gray;cursor:default;">Level 3</li>'+
							'{{/ifComplete}}' +
						'{{/if}}'+
					'{{/each}}' +
				'{{/ifRT}}' +
				'</ul>'+
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('board view initialized with ');
			console.log(this.model);
		},

		events: {
			'click .cards': 'showCard'
		},

		showCard: function(info){
			var level = info.currentTarget.id;
			var gm = location.hash.split('/')[4];
			if(info.currentTarget.id == 'complete'){
				console.log('complete selected, letting router pick it up');
			} else {
				app.AppView.vent.trigger('getCard', info.currentTarget.id);
			}
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);