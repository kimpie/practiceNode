var app = app || {};

(function ($) {

	Handlebars.registerHelper('firstName', function(name) {
	  return name.split(' ')[0];
	}),

	Handlebars.registerHelper('ifLive', function(place, options) {
		console.log(place);
	  if(place == 'Live') {
	    return options.fn(this);
	  } 
	}),
	Handlebars.registerHelper('ifOnline', function(place, options) {
		console.log(place);
	  if(place == 'Online') {
	    return options.fn(this);
	  } 
	}),
    Handlebars.registerHelper('lastP', function(context, options) {
    	console.log(context);
	 	for(var i=0; i<context.length; i++){
	 		if(word_turn == context[i].name){
	 			var pI = context[i].index;
	 			if(pI == 0){
	 				console.log(context.length - 1);
	 				return options.fn(context[context.length - 1]);
	 			} else {
	 				console.log(context[pI - 1]);
	 				return options.fn(context[pI - 1]);
	 			}
	 		} 
	 	};
	}),
	Handlebars.registerHelper('lastW', function(context, options) {
		console.log(context);
		var arr = context.split(' ');
		console.log(arr);
		return options.fn(arr[arr.length - 1]);
	}),
	Handlebars.registerHelper('ifwc', function(context, options) {
		console.log(context);
		if(context != 10 && context != 0){
			return options.fn(this);
		}
	}),


	app.gameView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row top_gv darkOrangeTop">' +
				'<div class="col-md-12" style="margin: 5px 0 5px 0;">'+
					'{{#ifOnline place}}' +
						'<div class=" col-xs-12 col-md-3 col-md-offset-2" id="word_countdown">' + 
							'{{word_countdown}} Words Remaining' +
						'</div>' +
					'{{/ifOnline}}' +
					'<div class="col-xs-12 col-md-7" id="playerList">'+
						'<ul>'+
						'{{#each players}}' +
							'<li id="players" class="{{firstName name}}">{{name}}</li>'+
						'{{/each}}'+
						'{{#ifLive place}}' +
							'<li id="players"><a id="addPlayer"><span class="glyphicon glyphicon-plus"></span></a></li>' +
						'{{/ifLive}}'+
						'</ul>'+ 
					'</div>'+
				'</div>' +
				'<div class="col-md-12">' +
				'{{#ifOnline place}}' +
				'{{#ifwc word_countdown}}'+
					'{{#lastP players}}<h3>{{name}} {{/lastP}}entered {{#lastW}}{{story}}{{/lastW}}'+
				'{{/ifwc}}'+
				'{{/ifOnline}}' +
				'</div>' +
			'</div>'
		),

	initialize: function  (options) {
		console.log('gameView triggered with options: ');
		console.log(options);
		this.model = options.model;

		//this.model.saveRound();
		this.model.bind("change", this.render, this);
		this.model.bind("reset", this.render);

	},

	events: {
		'click #addPlayer' : 'addPlayer'
	},


	addPlayer: function(){
		console.log('Add Another Player to this Game');
	},

	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;		
	}

	});

})(jQuery);

