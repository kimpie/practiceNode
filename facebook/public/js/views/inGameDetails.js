var inGameDetails = Backbone.View.extend({
	template: Handlebars.compile(
		'<div>' +
		'<h1>{{msg}} {{name}}</h1>' +
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
		'</div>' 

	),

	initialize: function  () {
		this.listenTo(this.model, "change", this.render);
		socket = io.connect('http://localhost:8080/');

	},

	events: {
		'click .btn-primary': 'chatterGame',
		'keypress #chat_box': 'sendchat'
	},

	sendchat: function (event) {
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