var app = app || {};

(function () {

	app.Card = Backbone.Collection.extend({
		model: app.cardModel,

		initialize: function(options){
			var hash = location.hash.split('/');
			console.log('cardCollection hash ' + hash);
			if (hash[4] == undefined){
				this.url = '/facebook/players/' + 'y' + '/games/' + 'x' + '/round/z'+'/cards';
			} else {
				this.url = '/facebook/players/' + hash[2] + '/games/' + hash[4] + '/round/' + hash[6] + '/cards';
			}
			app.AppView.vent.on('getCard', this.randomCard, this);
		},

		randomCard: function(level){
			console.log('cardCollection on randomCard');
			var gid = this.where({level: Number(level)});
			var that = this;
			function grabCard(collection){
				var model = that.get(collection[Math.floor(Math.random() * collection.length)]);
				return model;
			};	
			
			var card = grabCard(gid);
			console.log(card);
			app.AppView.vent.trigger('showCard', card);
		}
	});

})();