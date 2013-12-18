var Messages = Backbone.Collection.extend({
	comparator: 'name',
	model: messageModel,
	url: '/messages'
});