var app = app || {};

(function () {
        'use strict';
	
	app.playerModel = Backbone.Model.extend({
		urlRoot: '/players',
		defaults: {
			fb_id: "",
			first_name: "",
			last_name: "",
			name: "",
			gender: "",
			url: "",
			city: "",
			total_games: "",
      last_login: "",

			games: [{
			  id: "",
			  completed: false,
			  turn: "",
			  player1: "",
			  player2: "",
        sentence: ""
			}, 
			{ _id: false }]
			},

		initialize: function(){
	    console.log('The playerModel has been initialized.');
	  	},

    saveUser: function () {
      if (currentUser !== fb_id){
        this.save
      }
    },

  	// Save the updated sentence once a new word has been added and signal a new turn.
   /* updateSentence: function () {
      this.save({
        sentence: 
        turn:
      })
    },*/

    //Save game as completed.
    endGame: function() {
      this.save({
        completed: !this.get('completed')
      });
    }

    });


})();

/*
Leaving off at a good spot - the buttons are now working.  I'm thinking all of the lines in initialize 
object were causing the problem.  
Now need to fix the two errors - appview line 60 and playerModel "turn:" line 44.
Getting close :)
*/