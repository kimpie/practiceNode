var app = app || {};

(function ($) {
        'use strict';

	app.boardView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
				'<ul id="cardList">'+
					'{{#each round}}'+
						'{{#if level_one}}'+
							'<li id="one" class="col-xs-3 col-md-2 cards"><a href="{{url}}">Level 1</a></li>'+
						'{{/if}}'+
						'{{#if level_two}}'+
							'<li id="two" class="col-xs-3 col-md-2 cards"><a href="{{url}}">Level 2</a></li>'+
						'{{/if}}'+
						'{{#if level_three}}'+
							'<li id="three" class="col-xs-3 col-md-2 cards"><a href="{{url}}">Level 3</a></li>'+
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
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);