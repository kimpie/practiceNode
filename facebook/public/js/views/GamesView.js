(function ($) {
        'use strict';

	app.gameView = Backbone.View.extend({

		template: Handlebars.compile(


		'<div id="joined">'+
		'<div id="inGame">' +
		'<h1>Hello {{player1_name}}</h1>' +
		'<h2> Game with {{player2_name}}</h2>' +
		'</div>'+
		'<div id="display_name" >' +
		'<ul id="user_list">'+
		'<li id="user_id"></li>' +
		'</ul>' +
		'</div>' +
		'<div id="chatroom">' +
		'<ul id="chat_log">'+
		'<li id="chat_li"></li>' +
		'</ul>' +
		'</div>' +
		'<div id="inputbox">' +
		'<input id="chat_box" type="text" name="chat_box" placeholder="type to chat..."></>' +
		'</div>' +
		'</div>'  //div for joined
	),

	initialize: function  (game) {
		this.model = 
		this.listenTo(this.model, "change", this.render);
		socket = io.connect('https://completethesentence.com/');

	},

	events: {
		'click .btn-primary': 'join_room',
		'click .btn-success': 'requestDialog',
		'keypress #chat_box': 'send_chat'
	},

	join_room: function (event){
		var question = Number(prompt('What is 2 + 2?', 'enter answer here'));
		if (question === 4) {
			socket.emit('join', {status: 'joined'});
			console.log('Welcome to the room');
		}
		else {
			socket.emit('join', {status: 'not_joined'});
			console.log('Sorry, you are not allowed in this room');
		}		
	},


/*need to have a list of curerntGames per user and will need to match this up 
add this somewhere: 
var currentGame = (player1 === currentUser && player2 === response.to)
 the result should be a boolean if true, there is a current game, if false there is now game
*/
	requestDialog: function () {
	  FB.ui({method: 'apprequests',
	     message: 'Make up a story with me at Complete the Sentence game!' 
	    }, requestCallback);
	  	
	  	function requestCallback (response){
		  	if (response.to !== undefined) {
		  		socket.emit('join', {status: 'joined'});
				console.log("Sent request to " + response);
				testAPI();
				//game.create
				/*if (response.to && currentUser !=== currentGame){
		  			createGame 
			  	}
			  	else {
			  		alert('You\'re currently in a game with this Friend');
			  	}*/
		  	}
		  	else {
		  		socket.emit('join', {status: 'not_joined'});
				console.log('No player selected, response is ' + response.to);
		  	}
		};
	
		this.setPlayerData();	
		console.log('We are now saving user data.');
		this.model.save(this.model.attributes,
	      {
	      	success: function (model) {
						app.players.add(model);
						app.navigate('players/' + model.get('url'), {trigger: true});
		    }

	    });
	
	},

	

	send_chat: function (event) {
		if (event.which == 32 || event.which == 13) {
			socket.emit('chat', {message: jQuery('#chat_box').val()});
			jQuery('#chat_box').val('');
		}
	},

	render: function () {
		this.$el.html(this.template(this.model.attributes));
		//console.log(this);
		return this;
	}
	});

})(jQuery);