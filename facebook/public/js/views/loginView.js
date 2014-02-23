var loginView = Backbone.View.extend({

	id: 'loggedoff',

	template: Handlebars.compile(
	'<div class="row">' +
		'<div class="col-md-8">' +
			'<h2>Welcome to the Sentence Game!</h2>' +
			'<h4>How to Play:</h4>' + 
			'<p>Two people take turns building a sentence by entering one word per turn.  At any time, either player may complete the sentence by adding a period.' +
			'<em>Have fun and get creative!  The sentence can be shared with your friends or kept to yourself - you chose.</em></p>' +
		'</div>' +
			'<div class="col-md-4">' +
			'<h3>To begin, login</h3>' +
			'<id="login" fb:login-button show-faces="true" width="200" max-rows="1" id="login"></fb:login-button>' +
		'</div>' +
	'</div>' 

	),

	initialize: function  () {
		this.listenTo(this.model, "change", this.render);
		//this.el: $('#loggedoff');
		this.render();

	},

	events: {
		'click #login': 'loginFB'
	},

	login: function () {
		testAPI();

		this.setPlayerData();	
		console.log('We are now saving user data.');
		this.model.save(this.model.attributes,
	      {
	      	success: function (model) {
						app.players.add(model);
						app.navigate('players/' + model.get('url'), {trigger: true});
		    }

	    });
	
	},

	setPlayerData: function (){
		this.model.set({
			fb_id: currentUser,
			first_name: first_name,
			last_name: last_name,
			url: currentUser,
			name: name,
//			location: location,
			gender: gender,
			id: null
		});
	},

	render: function () {
		this.$el.html(this.template(this.model.attributes));
		//console.log(this);
		return this;
	}
});