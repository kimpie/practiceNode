var app = app || {};

(function ($) {
        'use strict';

	app.boardView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
				'<ul id="cardList">'+
					'<li class="col-xs-4 col-md-3 col-md-offset-1 cards lightBlue">Level 1</li>'+
					'<li class="col-xs-4 col-md-3 cards lightBlue">Level 1</li>'+
					'<li class="col-xs-4 col-md-3 cards lightBlue">Level 1</li>'+
				'</ul>' +
				'<ul id="cardList">' +
					'<li class="col-xs-4 col-md-3 col-md-offset-1 cards lightBlue">Level 1</li>'+
					'<li class="col-xs-4 col-md-3 cards lightBlue">Level 1</li>'+
					'<li class="col-xs-4 col-md-3 cards lightBlue">Level 1</li>'+
				'</ul>'+
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			this.complete = options.complete;
			console.log('board view initialized with ');
			console.log(this.model);
			this.model.bind("change", this.render, this);
			this.model.bind("reset", this.render);
			this.cards = this.$('ul#cardList > li');
			this.render();
			console.log(this.complete);
			this.loadColor();
		},

		events: {
			'click .cards': 'showCard'
		},

		loadColor: function(){
			if(this.complete.length == 0){
				this.round = 1;
				this.cards.addClass('lightBlue');
				console.log(this.cards);
				console.log('in round 1');
			} else if (this.complete.length > 1){
				console.log('in round 3');
				this.round = 3;
				this.cards.addClass('darkBlue');
			} else {
				console.log('in round 2');
				this.round = 2;
				this.cards.addClass('lightBlue');
			}
		},

		showCard: function(info){
			app.AppRouter.navigate(location.hash + '/round/' + this.round);
			app.AppView.vent.trigger('getCard', this.round);
		},

		render: function () {
			console.log('render happening');
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);