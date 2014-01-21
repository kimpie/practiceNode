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
			city: "",
			url: "",
			total_games: "",
      		last_login: "",

			games: [{
			  game_id: "",
			  completed: false,
			  turn: "",
			  player1: "",
			  player2: "",
        	  sentence: ""
			}, 
			{ _id: false }]
			},

		idAttribute: '_id',
/*		parse: function(response) {
		   response.id = response.fb_id;
		   return response;
		},*/

		/*setUrl: function(){
			if (this.idAttribute){
				url = this.idAttribute;
				console.log('Setting URL on initialization');
			} else {
				url = "";
			}
		},*/

		initialize: function(){
			console.log('The playerModel has been initialized.');
		//	this.checkNew();
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
Leaving off at a good spot - Next get url navigation working upon login which will tie into 
app.get and app.put.  You're doing GREAT!  Making excellent progress - keep it up!
Getting close :)
*/