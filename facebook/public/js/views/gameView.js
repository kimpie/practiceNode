var app = app || {};

(function ($) {

	app.gameView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="row top_gv">' +
				'<div class="col-md-12" id="playerList">'+
				'<ul>'+
				'{{#each players}}' +
				'<li id="players">{{name}}</li>'+
				'{{/each}}'+
				'<li id="players"><a id="addPlayer"><span class="glyphicon glyphicon-plus"></span></a></li>' +
				'</ul>'+ 
				'</div>'+
			'</div>' +
			'<div class="row top_gv">'+
				'<div class="col-md-12" id="playerTurn">'+
				'<h3>{{turn}}\'s Turn</h3>' +
				'</div>'+
			'</div>'+
			'<div id="board">'+
				'<div class="row" id="l1Cards">'+
					'<div class="col-xs-3 col-md-2 col-md-offset-3 cards" id="one">Level 1</div>'+
					'<div class="col-xs-3 col-md-2 cards" id="one">Level 1</div>'+
					'<div class="col-xs-3 col-md-2 cards" id="one">Level 1</div>'+
				'</div>'+
				'<div class="row" id="l2Cards">'+
					'<div class="col-xs-3 col-md-2 col-md-offset-3 cards" id="two"> Level 2</div>'+
					'<div class="col-xs-3 col-md-2 cards" id="two">Level 2</div>'+
				'</div>'+
				'<div class="row" id="l3Cards">'+
					'<div class="col-xs-3 col-md-2 col-md-offset-3 cards" id="three"> Level 3</div>'+
				'</div>'+
			'</div>'
		),

	initialize: function  (options) {
		console.log('gameView triggered with options: ');
		console.log(options);
		this.model = options.model;
		this.model.bind("change", this.render, this);
		this.model.bind("reset", this.render);

		var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
	},

	events: {
		'click #addPlayer' : 'addPlayer',
		'click .cards': 'level',
	},

	addPlayer: function(){
		console.log('Add Another Player to this Game');
	},

	level: function(info){
		console.log(info);
        var id = info.currentTarget.id;
		console.log('now we will find you a new card for level ' + id);
		var level = id;
		app.AppView.vent.trigger('cardView', level);
	},

	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;		
	}

	});

})(jQuery);

