var messageModel = Backbone.Model.extend({
	urlRoot: '/messages',
	defaults: {
		msg: 'Welcome',
		name: ''
	},
	start: function (data) {
		return this.save(data, {url: '/messages'})
	}
	
});