var app = app || {};

(function ($) {
        'use strict';

    Handlebars.registerHelper('ifComplete', function(complete, options) {
		console.log(complete);
	  if(complete) {
	    return options.fn(this);
	  } else {
	  	return options.inverse(this);
	  }
	}),

	app.boardView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
				'<ul id="cardList">'+
					'{{#each round}}'+
						'{{#if level_one}}'+
							'{{#ifComplete complete}}' +
								'<li id="1" class="col-xs-3 col-md-2 cards complete"><a href="{{url}}">Complete</a></li>'+
							'{{else}}'+
								'<li id="1" class="col-xs-3 col-md-2 cards"><a href="{{url}}">Level 1</a></li>'+
							'{{/ifComplete}}' +
							
						'{{/if}}'+
						'{{#if level_two}}'+
							'{{#ifComplete complete}}' +
								'<li id="2" class="col-xs-3 col-md-2 cards complete"><a href="{{url}}">Complete</a></li>'+
							'{{else}}'+
								'<li id="2" class="col-xs-3 col-md-2 cards"><a href="{{url}}">Level 2</a></li>'+
							'{{/ifComplete}}' +
							
						'{{/if}}'+
						'{{#if level_three}}'+
							'{{#ifComplete complete}}' +
								'<li id="3" class="col-xs-3 col-md-2 cards complete"><a href="{{url}}">Complete</a></li>'+
							'{{else}}'+
								'<li id="3" class="col-xs-3 col-md-2 cards"><a href="{{url}}">Level 3</a></li>'+
							'{{/ifComplete}}' +
							
						'{{/if}}'+
					'{{/each}}'+
				'</ul>'+
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('board view initialized with ');
			console.log(this.model);
			//if(this.model.story == undefined || this.model.story == ''){
			//	app.AppView.vent.trigger('getCard', this.model.number);
			//}
			
			//$('#storyTextt').append(this.model.story);
		},

		events: {
			'click .cards': 'showCard'
		},

		showCard: function(info){
			console.log(info.currentTarget);
			app.AppView.vent.trigger('getCard', info.currentTarget.id);
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);