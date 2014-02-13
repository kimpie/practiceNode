var gameslist = Backbone.Model.extend({
	urlRoot: '/players/:id/games',
	defaults: {
		msg: 'Welcome',
		title: 'Game with ',
		turn: ''
	},
	
	start: function( data ) {
      // POST name and number of players to 
      // server to create the game
      return this.save( data, { url: '/start' });
   }
   
});