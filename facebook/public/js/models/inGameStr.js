var gameModel = Backbone.Model.extend({
	urlRoot: '/inGame',
	defaults: {
		msg: 'Welcome',
		title: 'Game with ',
		name: ''
	}

});
