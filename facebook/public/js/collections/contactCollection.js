var app = app || {};

(function () {

	app.Contact = Backbone.Collection.extend({
		model: app.contactModel,
		url: '/facebook/contact',

		initialize: function(options){
			console.log('contactCollection has options:');
			console.log(options);
		},

		newModel: function(info){
			console.log('inside cc new model');
			console.log(info);
			this.create({
				name: info.name,
				comments: info.comments,
				player_id: info.player_id
			},{
				success:function(){
					console.log('successfully saved contact form');
					app.AppView.vent.trigger('ty');
				}
			});
		}
	});

})();