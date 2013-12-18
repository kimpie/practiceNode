var messageView = Backbone.View.extend({

	template: Handlebars.compile(
		'<div id="msg">' +
		'<textarea class="message"></textarea>' +
		'<br />' +
		'<input type="text" name="name" placeholder="enter name here"></>' +
		'<br />' +
		'<input type="text" name="url" placeholder="enter url here"></>' +
		'<br />' +
		'<button class="post-message">Submit</button>' +
		'</div>'
	),

	initialize: function  () {
		this.listenTo(this.model, "change", this.render);

	},

	render: function  () {
		this.$el.html(this.template());
		this.delegateEvents({
			'click .post-message': 'postMessage'
		});
		return this;
	},
    
    postMessage: function() {
    	this.setModelData();
    	console.log("posting message from messageView")
      
      this.model.save(this.model.attributes,
      {
      	success: function (model) {
					app.messages.add(model);
					app.navigate('message/' + model.get('url'), {trigger: true});
	    }

      });
    },

    setModelData: function  () {
		this.model.set({
			msg: this.$el.find('textarea[class="message"]').val(),
			name: this.$el.find('input[name="name"]').val(),
			url: this.$el.find('input[name="url"]').val(),
			id: null
		});
	}

});