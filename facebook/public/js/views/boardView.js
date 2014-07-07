var app = app || {};

(function ($) {
        'use strict';

    Handlebars.registerHelper('firstComplete', function(round, options) {
    	console.log(round);
		for(var i=0; i < round.length; i++){
			if(!round[i].complete){
				console.log('round ' + round[i].number + ' not complete, showing cards');
				return '<div id="card' + round[i].number +'">' + options.fn(this) + '</div>';
			}
			break;
		}
	}),


	app.boardView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row">'+
			'{{#firstComplete round}}'+
				'<ul id="cardList">'+
					'<li class="col-xs-4 col-md-3 col-md-offset-1 cards" title="1980\'s" style="background-image: url(https://i.imgur.com/MipnJcT.png); background-position: center center; background-repeat:no-repeat;"></li>' +
					'<li class="col-xs-4 col-md-3 cards" title="1990\'s" style="background-image: url(https://i.imgur.com/Lg1khA7.png); background-position: center center; background-repeat:no-repeat;"></li>' +
					'<li class="col-xs-4 col-md-3 cards" title="2000\'s" style="background-image: url(https://i.imgur.com/TPuIH9I.png); background-position: center center; background-repeat:no-repeat;"></li>' +
				'</ul>' +
				'<ul id="cardList">' +
					'<li class="col-xs-4 col-md-3 col-md-offset-1 cards" title="Animals" style="background-image: url(https://i.imgur.com/IVwyFoF.png); background-position: center center; background-repeat:no-repeat;"></li>' +
					'<li class="col-xs-4 col-md-3 cards" title="Love" style="background-image: url(https://i.imgur.com/yOzRZXL.png); background-position: center center; background-repeat:no-repeat;"></li>' +
					'<li class="col-xs-4 col-md-3 cards" title="Entertainment" style="background-image: url(https://i.imgur.com/yOzRZXL.png); background-position: center center; background-repeat:no-repeat;"></li>' +
				'</ul>' +
			'{{/firstComplete}}'+
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
			var category = info.curentTarget.title;
			console.log(category);
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