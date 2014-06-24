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
    

	app.homeView = Backbone.View.extend({

		template: Handlebars.compile(
			'<section id="userName">' +
				'<div class="row">' +
					'<div class="col-md-12" id="ng_words">' +
						'<h1>fib: <em>noun</em> a lie, typically an unimportant one.</h1>' +
						'<h3>Don\'t tell fibs, play them!</h3>' +
					'</div>'+
					'<div class="col-xs-12 col-md-12" id="startbtn">'+
						'<h2>Start Fib</h2>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col-md-12" style="padding: 0px">' +
						'<ul id="gamelist">' +
							'{{#each games}}' +
							'{{#ifMyTurn turn}}' +
								'<li id="player_name"><a id="indGame" href="{{url}}"><h3 style="margin-top:0px; margin-bottom:0px;">Fib with {{#each players}}{{name }} {{/each}}</h3></a></li>' +
							'{{else}}' +
								'<li id="player_name"><a disabled="disabled" id="indGame" href="{{url}}"><h3 style="margin-top:0px; margin-bottom:0px;">Fib with {{#each players}}{{name }} {{/each}}</h3></a></li>' +
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
			app.AppView.vent.on('updatehv', this.render, this);
			this.room = this.model.id;
			var socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
			socket.emit('room', {room: this.room});
			app.AppView.vent.on('updatePlayer', this.test, this);
		},

		test: function(data){
			if(data.room == this.room){
				console.log('homeview received data from socket ' + data.room);
				this.render();
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