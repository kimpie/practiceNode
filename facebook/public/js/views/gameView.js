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
	Handlebars.registerHelper('ifwc', function(context, options) {
		console.log(context);
		if(context != 10 && context != 0){
			return options.fn(this);
		}
	}),
    Handlebars.registerHelper('lastP', function(players, word_turn) {
    	console.log(players);
    	console.log(word_turn);
    	for(var i=0; i<players.length; i++){
	 		if(word_turn == players[i].name){
		        console.log(players.indexOf(players[i]));
		        var pI = players.indexOf(players[i]);
	 			if(pI == 0){
	 				console.log(players.length - 1);
	 				return players[players.length - 1].name;
	 			} else {
	 				console.log(players[pI - 1]);
	 				return players[pI - 1].name;
	 			}
	 		} 
	 	};
	}),
	Handlebars.registerHelper('lastW', function(round) {
		console.log(round);
		var arr;
		function getStory(element, index, array){
			if(element.in_progress){
				console.log(element.story);
				arr = element.story.split(' ');
			}
		}
		round.forEach(getStory);
		return arr[arr.length - 1];
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
						'</ul>'+ 
					'</div>'+
				'</div>' +
				'<div class="col-md-12">' +
				'{{#ifOnline place}}' +
				'{{#ifwc word_countdown}}'+
					'<h3>{{lastP players word_turn}} entered "<strong>{{lastW round}}</strong>"'+
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

