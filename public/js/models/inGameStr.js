var gameModel = Backbone.Model.extend({
	urlRoot: '/players',
	defaults: {
		msg: 'Welcome',
		title: 'Game with ',
		name: ''
	}
	
});
