var GameView = Backbone.View.extend({
	
	template: Handlebars.compile(
		'<div>' +
		'<h3>Invite a friends to get started</h3>' +

	),

	initialize: function  () {
		this.listenTo(this.model, "reset", this.render);
      	socket = io.connect('https://completethesentence.com/');

	},

	events: {
		'click .btn-primary': 'newGame'
	},

	newGame: function (){
		game.start( { name: dialog.name, numPlayers: dialog.numPlayers } ).then(
		   function( data ) {
		       		     
		      // Wait for connection and then emit the join message with
		      // the room and player ID provided in the API response.
		      socket.on( 'connect', function() {
		         socket.emit( 'join', { room: data.room, player: data.player } );
		      });
		   },
		   function() {
		      // Error
		   }
		);
	}

	render: function () {
	this.$el.html(this.template(this.model.attributes));
		return this;
	}
});