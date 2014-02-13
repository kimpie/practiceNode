var app = app || {};

(function ($) {
        'use strict';

	app.PlayersView = Backbone.View.extend({

		template: Handlebars.compile(
			'<h3>Welcome {{name}}</h3>' 
		),

		events: {

		},

		initialize: function  () {
			console.log('PlayersView has been initialized');
			//this.model.save(this.setPlayerData(), {patch: true});
			//this.model.bind("change:loggedin", this.render, this);

			this.listenTo(this.model, "change", this.notice);
			this.listenTo(this.model, "change", this.render);
		//	socket = io.connect('https://completethesentence.com/');
		},

		PlayerData: function (){
			this.model.save(this.PlayerData());
		},

		setPlayerData: function(){
			var x = new Date();
		    var currentTimeZoneOffsetInHours = x.getTimezoneOffset() / 60;
			return {
				fb_id: currentUser,
				first_name: first_name,
				last_name: last_name,
				name: name,
				city: city,
				url: currentUser,
				gender: gender,
				last_login: x
			};
		},

		notice: function (){
			console.log('Something on the model has changed.');
		},

		render: function () {
			this.$el.html(this.template(this.model.attributes));
			//this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
			//this.toggleVisible();                                             // NEW
			
			return this;
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