var gameRules = Backbone.View.extend({

	template: Handlebars.compile(
		'<div id="rules">' +
		'<h4>How to play:</h4>' +
		'<p>Two people take turns building a sentence by entering one word per turn.  At any time, either player may complete the sentence by adding a period. </p>' +
		'<p><em>Have fun and get creative!  The sentence can be shared with your friends or kept to yourself - you chose.</em></p>'+
		'<h4>Earn Points</h4>'+
		'<p><b>Earn Individually</b></p>'+
		'<ul>'+
		'<li>Word with 5-6 letters:<class="text-primary"> x points</class="text-primary"></li>'+
		'<li>Word with 7-9 letters:<class="text-primary"> x points</class="text-primary"> </li>'+
		'<li>Word with 10+ letters:<class="text-primary"> x points</class="text-primary"></li>' +
		'<li>Invite a friend: 2 points</li>' +
		'<li>Share the sentence:<class="text-primary"> x points</class="text-primary"></li>' +
		'</ul>' +
		'<p><b>Earn Together</b></p>' +
		'<ul>' +
		'<li>Sentence with 10-15 words:<class="text-primary"> x points</class="text-primary"></li>' +
		'<li>Sentence with 15-20 words:<class="text-primary"> x points</class="text-primary"></li>'+
		'<li>Sentence with 20 words:<class="text-primary"> x points</class="text-primary"></li>'+
		'</ul>'+
		'</div>'
	),

	render: function  () {
		this.$el.html(this.template());
		return this;
	}

});