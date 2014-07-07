var app = app || {};

(function ($) {
        'use strict';

	Handlebars.registerHelper('ifMyTurn', function(turn, options) {
		console.log('turn for ' + turn + ' I\'m ' + name);
	  if(turn == name) {
	    return options.fn(this);
	  } else {
	  	return options.inverse(this);
	  }
	}),
    
    Handlebars.registerHelper('insertComma', function(context, options) {
		console.log(context);
	 	var str = '';
	 	for(var i=0; i<context.length; i++){
	 		if(i == context.length -1){
	 			str = str + options.fn(context[i]);
	 		} else {
	 			str = str + options.fn(context[i]) + ', ';
	 		}
	 	};
	 	return str;
	}),

	Handlebars.registerHelper('ifIP', function(stage, options) {
		console.log(stage);
	 	if(stage != 'waiting'){
	 		return options.fn(this);
	 	}
	}),

	app.homeView = Backbone.View.extend({

		template: Handlebars.compile(
			'<section id="userName">' +
				'<div class="row">' +
					'<div class="col-xs-12 col-md-12 darkOrangeTop" id="ng_words">' +
						'<h2>fib: <em>noun</em> a lie, typically an unimportant one.</h2>' +
						'<h3>Don\'t tell fibs, play them!</h3>' +
					'</div>'+
					'<div class="col-xs-12 col-md-12 lightOrange" id="startbtn">'+
						'<h2>Start Fib</h2>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col-xs-12 col-md-12" style="padding: 0px">' +
						'<ul id="gamelist">' +
							'{{#each games}}' +
								'{{#ifMyTurn turn}}' +
									'<li id="player_name"><a id="indGame" href="{{url}}"><h3 style="margin-top:0px; margin-bottom:0px;">Fib with {{#insertComma players}}{{#ifIP stage}}{{name}}{{else}}waiting{{/ifIP}}{{/insertComma}}</h3></a></li>' +	
								'{{else}}' +
									'<li id="notTurn"><h3 style="margin-top:0px; margin-bottom:0px;">Fib with {{#insertComma players}}{{#ifIP stage}}{{name}}{{else}}waiting{{/ifIP}}{{/insertComma}}</h3></li>' +
								'{{/ifMyTurn}}' +
							'{{/each}}' +
						'</ul>' +
					'</div>' +
				'</div>' +
			'</section>' 
		),

		events: {
			'click #startbtn' : 'request'
		},

		initialize: function  (options) {
			this.model = options.model;
			this.model.bind('reset', this.render);			
			this.listenTo(this.model, "change", this.render);
			this.room = this.model.attributes.fb_id;
			var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
			socket.emit('room', {room: this.room});
			app.AppView.vent.once('updatePlayer', this.test, this);
			app.AppView.vent.on('updateHv', this.render, this);
		},

		test: function(data){
			if(data.room == this.room){
				console.log('homeview received data from socket ' + data.room);
				var game = data.game;
				var round = data.round;
				this.model.updateTurn(game, round);
			}
		},

		request: function(){
			app.AppView.vent.trigger('requestGame');
		},

		render: function () {
			console.log('render called for ' + this.model.id);
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);