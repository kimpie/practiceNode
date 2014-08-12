var app = app || {};

(function () {

	app.Words = Backbone.Collection.extend({
		model: app.wordModel,

		initialize: function(options){
			console.log('app.Words initialized');
			var hash = location.hash.split('/');
			if (hash[4] == undefined){
				this.url = '/facebook/players/' + 'y' + '/games/' + 'x' + '/words';
			} else {
				this.url = '/facebook/players/' + hash[2] + '/games/' + hash[4] + '/words';
			}
			app.AppView.vent.on('getWord', this.randomWord, this);
		},

		randomWord: function(){
			console.log(this);
			var that = this;
			function grabWord(collection){
				var m = collection.at([Math.floor(Math.random() * collection.length)])
				console.log(m);
				return m;
			};	
			var word = grabWord(this);
			console.log(word);
			app.AppView.vent.trigger('showWord', word.attributes.word);
		}
	});

})();