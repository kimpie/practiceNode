var app = app || {};

(function ($) {
        'use strict';

    Handlebars.registerHelper('firstComplete', function(round, options) {
    	console.log(round);
		for(var i=0; i < round.length; i++){
			if(!round[i].complete){
				console.log('round ' + round[i].number + ' not complete, showing cards');
				return '<div id="card' + round[i].number +'">' + options.fn(this) + '</div>';
				break;
			}
		}
	}),


	app.boardView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
			'{{#firstComplete round}}'+
				'<ul id="cardList">'+
					'<li class="col-xs-4 col-md-3 col-md-offset-1 cards" title="The 80\'s" style="background-image: url(https://i.imgur.com/MipnJcT.png); background-position: center center; background-repeat:no-repeat; background-size: contain;"></li>' +
					'<li class="col-xs-4 col-md-3 cards" title="The 90\'s" style="background-image: url(https://i.imgur.com/Lg1khA7.png); background-position: center center; background-repeat:no-repeat;background-size: contain;"></li>' +
					'<li class="col-xs-4 col-md-3 cards" title="2000\'s" style="background-image: url(https://i.imgur.com/TPuIH9I.png); background-position: center center; background-repeat:no-repeat;background-size: contain;"></li>' +
				'</ul>' +
				'<ul id="cardList">' +
					'<li class="col-xs-4 col-md-3 col-md-offset-1 cards" title="Animals" style="background-image: url(https://i.imgur.com/Cu59osr.png); background-position: center center; background-repeat:no-repeat;background-size: contain;"></li>' +
					'<li class="col-xs-4 col-md-3 cards" title="Love" style="background-image: url(https://i.imgur.com/gd3uqX6.png); background-position: center center; background-repeat:no-repeat;background-size: contain;"></li>' +
					'<li class="col-xs-4 col-md-3 cards" title="Anything" style="background-image: url(https://i.imgur.com/XlnVSeD.png); background-position: center center; background-repeat:no-repeat;background-size: contain;"></li>' +
				'</ul>' +
			'{{/firstComplete}}'+
			'</div>'
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('board view initialized with ');
			console.log(this.model);
			this.model.bind("change", this.render, this);
			this.model.bind("reset", this.render);
		},

		events: {
			'click .cards': 'showCard'
		},

		showCard: function(info){
			var round;
			for(var i=0; i < this.model.attributes.round.length; i++){
				if(!this.model.attributes.round[i].complete){
					round = this.model.attributes.round[i].number;
					break;
				}
			};
			var category = info.currentTarget.title;
			console.log(category);
			app.AppRouter.navigate(location.hash + '/round/' + round);
			app.AppView.vent.trigger('getCard', round, category);
		},

		render: function () {
			console.log('render happening');
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);