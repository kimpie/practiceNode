var newGameButton = Backbone.View.extend({

	template: Handlebars.compile(
		'<div>' +
		'<button type="button" class="btn btn-primary">Start New Game</button>' +
		'</div>'
	),

	initialize: function  () {
		socket = io.connect('http://localhost:8080/')
	},

	events: {
		'click .btn-primary': 'newRoom'
	},

//Create and join a new room that takes your socket.id as the room name
	newRoom: function (){
		var game_name = prompt('Who would you like to play with?', '...');
		window.open('#/inGame/:game_name', function  (req, res) {
		  var matches = inGame.filter(function  (game) {
		    return game.url === req.params.game_name;
		  });

		  if (matches.length > 0) {
		    res.json(matches[0]);
		  } else {
		    res.json(404, {status: 'invalid game name'});
		  }

		});
		socket.emit('room', game);
	},

	render: function  () {
		this.$el.html(this.template());
		return this;
	}

});