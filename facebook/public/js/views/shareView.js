var app = app || {};

(function ($) {
        'use strict';

	app.shareView = Backbone.View.extend({

		template: Handlebars.compile(
			'<button type="button" class="btn btn-default btn-block" id="deleteGame">End Game</button>' 
		),

		template2: Handlebars.compile(
			'<p class="alignright">Madfibs</p>'+
			'<div style="clear: both;"></div>' 
		),

		events: {
			'click #deleteGame' : 'removeGame'
		},

		initialize: function  (options) {
			console.log(options);
			this.model = options.model;
			console.log('shareView has been initialized');
			this.listenTo(this.model, "change", this.render);
		},

		removeGame: function(){
			var model = this.model;
			var player = this.model.attributes.player1;
			var deleteGame = confirm('Are you sure you want to delete this game?  \nIt will be deleted permanently.');
			if (deleteGame){
				app.AppView.vent.trigger('removeGame', model, player);
			}
		},

		render: function () {
			if (this.model.attributes.fb_id != undefined){
				console.log('player model');
				this.$el.html(this.template2(this.model.attributes));
				return this;
			} else{
				console.log('game model');
				this.$el.html(this.template(this.model.attributes));
				return this;
			}
		}

	});

})(jQuery);