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
				'<div class="col-md-12" id="playerTurn">'+
					'<h3>{{turn}}\'s Turn</h3>' +
				'</div>'+
			'</div>'+
			'<div id="board">'+
				'<div class="row" id="l1Cards">'+
					'<div class="col-xs-3 col-xs-offset-1 col-md-2 col-md-offset-3 cards" id="one">Level 1</div>'+
					'<div class="col-xs-3 col-md-2 cards" id="one">Level 1</div>'+
					'<div class="col-xs-3 col-md-2 cards" id="one">Level 1</div>'+
				'</div>'+
				'<div class="row" id="l2Cards">'+
					'<div class="col-xs-3 col-xs-offset-1 col-md-2 col-md-offset-3 cards" id="two"> Level 2</div>'+
					'<div class="col-xs-3 col-md-2 cards" id="two">Level 2</div>'+
				'</div>'+
				'<div class="row" id="l3Cards">'+
					'<div class="col-xs-3 col-xs-offset-1 col-md-2 col-md-offset-3 cards" id="three"> Level 3</div>'+
				'</div>'+
			'</div>'
		),

	initialize: function  (options) {
		console.log('gameView triggered with options: ');
		console.log(options);
		this.model = options.model;
		this.model.bind("change", this.render, this);
		this.model.bind("reset", this.render);
		app.AppView.vent.on('showCard', this.showCard, this);
		var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
		this.board = this.$('#board');
	},

	events: {
		'click #addPlayer' : 'addPlayer',
		'click .cards': 'level',
	},

	addPlayer: function(){
		console.log('Add Another Player to this Game');
	},

	level: function(info){
        var level = info.currentTarget.id;
        var game = this.model;
		console.log('now we will find you a new card for level ' + level);
		app.AppView.vent.trigger('getCard', level, game);
	},

	showCard: function(card){
		console.log(card);
		var card = card;
		var cv = new app.cardView({model: card});
		this.board.html(cv.render().el);
	},

	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this;		
	}

	});

	app.cardView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div class="well" id="card">'+
				'<div class="col-md-10 col-md-offset-1">Direction</div>' + 
				'<div class="col-md-10 col-md-offset-1"> {{direction}} </div>' +
				'<div class="col-md-10 col-md-offset-1">Rule</div>' + 
				'<div class="col-md-10 col-md-offset-1">{{rule}} </div>' +
			'</div>' 
		),

		initialize: function  (options) {
			this.model = options.model;
			console.log('card view initialized with ');
			console.log(this.model);
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);

