var app = app || {};

(function ($) {
        'use strict';

	app.PlayersView = Backbone.View.extend({

		template: Handlebars.compile(
			'<h3>Welcome {{name}}</h3>' +
			'<button type="button" class="btn btn-success" id="btn-success">Invite Friends</button>'
		),

		events: {
			"click #btn-success": "requestDialog"
		},

		initialize: function  () {
			console.log('PlayersView has been initialized');
			this.listenTo(this.model, "change", this.render);
			this.render();
		//	socket = io.connect('https://completethesentence.com/');
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));

			//this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
			//this.toggleVisible();                                             // NEW
			
			return this;
		},

		requestDialog: function () {
			var model = this.model;

		  FB.ui({method: 'apprequests',
		     message: 'Join me to tell a crazy story!' 
		    }, requestCallback);

		  	function requestCallback (response){
			  	if (response.to !== undefined) {
			  		//socket.emit('join', {status: 'joined'});
					console.log(response);
					model.save(this.setGameData);
					//game.create
					/*if (response.to && currentUser !=== currentGame){
			  			createGame 
				  	}
				  	else {
				  		alert('You\'re currently in a game with this Friend');
				  	}*/
			  	}
			  	else {
			  		//socket.emit('join', {status: 'not_joined'});
					console.log('No player selected, response is ' + response);
			  		}
			};
		},
		
		setGameData: function (){
			return {
					game_id: response.request,
					player1: currentUser,
					player2: response.to
			};
		}


	    /*toggleVisible : function () {
	      this.$el.toggleClass( 'hidden',  this.isHidden());
	    }

	   /* isHidden : function () {
	      var isCompleted = this.model.get('completed');
	      return ( // hidden cases only
	        (!isCompleted && app.TodoFilter === 'completed')
	        || (isCompleted && app.TodoFilter === 'active')
	      );
	    },

	    togglecompleted: function() {
	      this.model.toggle();
	    },*/

	});
})(jQuery);