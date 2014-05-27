var app = app || {};

(function () {

	app.Card = Backbone.Collection.extend({
		model: app.cardModel,

		initialize: function(options){
			console.log(options);
			app.AppView.vent.on('getCard', this.randomCard, this);
		},

		randomCard: function(level){
			var level = level;
			var gid = this.where({level: level});
			var that = this;
			function grabCard(collection){
				var model = that.get(collection[Math.floor(Math.random() * collection.length)]);
				return model;
			};	
			
			var card = grabCard(gid);
			app.AppView.vent.trigger('showCard', card);

		},

		url: function(){
			return '/facebook/players/' + 'x' + '/games/' + 'y' + '/cards';
		}
	});

})();