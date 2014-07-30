var app = app || {};

(function ($) {
        'use strict';

	Handlebars.registerHelper('ifMyTurn', function(turn, controller, options) {
	  if(turn == name) {
	    return options.fn(this);
	  } else if (controller == true){
	  	return options.fn(this);
	  } 
	}),
	Handlebars.registerHelper('ifNotTurn', function(turn, controller, options) {
	  if(turn != name) {
	    return options.fn(this);
	  } 
	}),
    
    Handlebars.registerHelper('insertComma', function(context, options) {
	 	var str = '';
	 	var arr = context;
		var np=[];
		function removeMe(element,index,array){
		  if(element.name != name){
		      np.push(element);
		  }
		};
		arr.forEach(removeMe);
	 	for(var i=0; i<np.length; i++){
	 		console.log(np[i].name);
	 		if(i == np.length -1){
	 			str = str + options.fn(np[i]);
	 		} else {
	 			str = str + options.fn(np[i]) + ', ';
	 		}
	 	};
	 	return str;
	}),

	Handlebars.registerHelper('ifIP', function(stage, options) {
	 	if(stage != 'removed'){
	 		return options.fn(this);
	 	}
	}),
	Handlebars.registerHelper('ifRE', function(stage, options) {
	 	if(stage == 'removed'){
	 		return options.fn(this);
	 	}
	}),

	app.homeView = Backbone.View.extend({

		template: Handlebars.compile(
			'<section id="userName">' +
				'<div class="row" style="display:none;">' +
					'<div class="col-xs-12 col-md-12 darkOrangeTop" id="ng_words">' +
						'<h2>fib: <em>noun</em> a lie, typically an unimportant one.</h2>' +
						'<h3>Don\'t tell fibs, play them!</h3>' +
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col-xs-12 col-md-12 darkOrange startbtn" id="strategy">'+
						'<h2>play fibs with strategy</h2>'+
					'</div>'+
					'<div class="col-xs-12 col-md-12 lightOrange startbtn" id="rounds">'+
						'<h2>play fibs with rounds</h2>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col-xs-12 col-md-12" style="padding-left: 0px; padding-right: 0px;">' +
						'<h4 style="text-align:left;">your games</h4>' +
						'<ul id="gamelist">' +
							'{{#each games}}' +
								'{{#ifIP stage}}' +
								'{{#ifMyTurn turn controller}}' +
									'<li id="player_name"><a id="indGame" href="{{url}}"><h3 style="margin-top:0px; margin-bottom:0px;">Fib with {{#insertComma players}}{{name}}{{/insertComma}}</h3></a></li>' +	
								'{{/ifMyTurn}}' +
								'{{/ifIP}}' +
							'{{/each}}' +
						'</ul>' +
						'<ul id="gamelist">' +
							'{{#each games}}' +
								'{{#ifIP stage}}' +
								'{{#ifNotTurn turn controller}}' +
									'<li id="notTurn"><a href="{{url}}"><h3 style="margin-top:0px; margin-bottom:0px;">Waiting for {{#insertComma players}}{{name}}{{/insertComma}}</h3></a></li>' +	
								'{{/ifNotTurn}}' +
								'{{/ifIP}}' +
							'{{/each}}' +
						'</ul>' +
						'<ul id="gamelist">' +
							'{{#each games}}' +
								'{{#ifRE stage}}' +
									'<h4 style="text-align:left;">game over</h4>' +
									'<li id="notTurn"><h3 style="margin-top:0px; margin-bottom:0px;">Fib with {{#insertComma players}}{{name}}{{/insertComma}}</h3></li>' +
								'{{/ifRE}}' +
							'{{/each}}' +
						'</ul>' +
					'</div>' +
				'</div>' +
			'</section>' 
		),

		events: {
			'click .startbtn' : 'request'
			//'click #startstrategy': 'strategy'
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

		strategy: function(e){
			e.preventDefault();
			console.log('should generate random word');
			var k;
			function RandomWord() {
				console.log('inside RandomWord fn');
		       var requestStr = "http://randomword.setgetgo.com/get.php";
		       $.ajax({
		           type: "GET",
		           url: requestStr,
		           dataType: "jsonp",
		           jsonpCallback: 'RandomWordComplete',
                   success:function(result){
		                console.log(result);
		                k = result.Word.split('/')[0];
		            }
		       });
		    };
		    function RandomWordComplete(data) {
		       console.log(data.Word);
		    };
			RandomWord();
			console.log(k);
		},

		test: function(data){
			if(data.room == this.room){
				console.log('homeview received data from socket ' + data.room);
				var game = data.game;
				var round = data.round;
				this.model.updateTurn(game, round);
			}
		},

		request: function(info){
			console.log(info.currentTarget.id);
			var type = info.currentTarget.id;
			app.AppView.vent.trigger('requestGame', type);
		},

		render: function () {
			console.log('render called for ' + this.model.id);
			this.$el.html(this.template(this.model.attributes));
			return this;
		}

	});

})(jQuery);