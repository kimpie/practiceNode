var inGameDetails = Backbone.View.extend({
	template: Handlebars.compile(
		'<div id="not_joined">' +
		'<div>' +
		'<button type="button" class="btn btn-primary">Start New Game</button>' +
		'</div>'+
		'</div>' +

		'<div id="joined">'+
		'<div id="social>'+
		'<button type="button" class="btn btn-success">Send Invite to Friends</button>'+
		'</div>' +
		'<div>' +
		'<h1>{{msg}} {{name}}</h1>' +
		'<h2> You\'re in room {{room}}</h2>' +
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

	initialize: function  () {
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

	requestDialog: function () {
	  FB.ui({method: 'apprequests',
	     message: 'Play Complete the Sentence game with me! It\'s hilaious!' 
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