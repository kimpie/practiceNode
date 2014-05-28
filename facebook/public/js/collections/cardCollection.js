var app = app || {};

(function () {

	app.Card = Backbone.Collection.extend({
		model: app.cardModel,

		initialize: function(options){
			console.log('cardCollection initialized');
			console.log(options);
		},

		randomCard: function(level){
			console.log('cardCollection on randomCard');
			var level = level;
			var gid = this.where({level: level});
			var that = this;
			function grabCard(collection){
				var model = that.get(collection[Math.floor(Math.random() * collection.length)]);
				return model;
			};	
			
			var card = grabCard(gid);
			console.log(card);
			app.AppView.vent.trigger('showCard', card);
		},

		url: function(){
			return '/facebook/players/' + 'x' + '/games/' + 'y' + '/cards';
		}
	});

})();