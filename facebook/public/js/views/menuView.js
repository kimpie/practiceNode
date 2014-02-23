var menuView = Backbone.View.extend({

	tagname: 'div',

	template: Handlebars.compile(
		'<nav class="navbar navbar-default navbar-fixed-top" role="navigation">' +
			'<a class="navbar-brand navbar-center brand" href="/facebook">Complete the Sentence</a>' +
			'<button type="button" class="btn btn-default btn-lg navbar-right">' +
			'<span class="glyphicon glyphicon-th"></span>' +
			'</button>' +
		'</nav>' +
		'<ul class="nav nav-pills">' +
			'<li><a href="#">Games</a></li>' +
			'<li><a href="#/inGame/new">New Game</a></li>' +
			'<li><a href="#/inGame/sussie">sussie</a></li>' +
		'</ul>'
		/*'<ul class="nav nav-pills">' +
			'<li><class="rules" a href="/#">Rules</a></li>' +
			//'<p class="prules">Two people take turns building a sentence by entering one word per turn.  At any time, either player may complete the sentence by adding a period. </p>' +
			//'<p class="prules"><em>Have fun and get creative!  The sentence can be shared with your friends or kept to yourself - you chose.</em></p>'+
			'<li><class="points" a href="/#">Points</a></li>' +
			/*	'<p class="pointy"><b>Earn Individually</b></p>'+
				'<ul class="pointy">'+
				'<li>Word with 5-6 letters:<class="text-primary"> x points</class="text-primary"></li>'+
				'<li>Word with 7-9 letters:<class="text-primary"> x points</class="text-primary"> </li>'+
				'<li>Word with 10+ letters:<class="text-primary"> x points</class="text-primary"></li>' +
				'<li>Invite a friend: 2 points</li>' +
				'<li>Share the sentence:<class="text-primary"> x points</class="text-primary"></li>' +
				'</ul>' +
				'<p class="pointy"><b>Earn Together</b></p>' +
				'<ul class="pointy">' +
				'<li>Sentence with 10-15 words:<class="text-primary"> x points</class="text-primary"></li>' +
				'<li>Sentence with 15-20 words:<class="text-primary"> x points</class="text-primary"></li>'+
				'<li>Sentence with 20 words:<class="text-primary"> x points</class="text-primary"></li>'+
				'</ul>'+
			'<li><class="feedback" a href="/#">Comments</a><li>' +
		'</ul>'*/
	),

	initialize: function  () {
		this.$el = $('#header2');
	},

	events: {
		'click glyphicon-th': 'menu'
		//'click .rules': 'rules',
		//'click .points': 'points',
		//'click .feedback': 'feedback'
	},

	menu: function(){
		console.log('this button is working now');
	},
/*
	rules: function (){
		$( document.p.prules ).click(function () {
		  if ( $( "p.prules:first" ).is( ":hidden" ) ) {
		    $( "p" ).slideDown( "slow" );
		  } else {
		    $( "p" ).hide();
		  }
		});
	},

	points: function(){
		$( document.pointy ).click(function () {
		  if ( $( "pointy:first" ).is( ":hidden" ) ) {
		    $( "pointy" ).slideDown( "slow" );
		  } else {
		    $( "pointy" ).hide();
		  }
		});
	},

	feedback: function (){

	},*/

	render: function () {
	this.$el.html(this.template(this.model.attributes));
		return this;
	}

});