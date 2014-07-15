var app = app || {};

(function ($) {
        'use strict';

	app.tutorialView = Backbone.View.extend({

		template: Handlebars.compile(
			'<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">' +
			  <!-- Indicators -->
			  '<ol class="carousel-indicators">' +
			    '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>' +
			    '<li data-target="#carousel-example-generic" data-slide-to="1"></li>' +
			    '<li data-target="#carousel-example-generic" data-slide-to="2"></li>' +
			  '</ol>'+

			  <!-- Wrapper for slides -->
			  '<div class="carousel-inner">' +
			    '<div class="item active">' +
			      '<img src="https://i.imgur.com/qWizSL2.png" alt="test">' +
			      '<div class="carousel-caption">' +
			        '<h1>Test1</h1>' +
			      '</div>' +
			    '</div>' +
			    '<div class="item">' +
			      '<img src="https://i.imgur.com/yOzRZXL.png" alt="test2">' +
			      '<div class="carousel-caption">' +
			        '<h2>Test2</h2>'+
			      '</div>'+
			    '</div>'+
			    '<h4>Where does this go?</h4>'+
			  '</div>'+

			  <!-- Controls -->
			  '<a class="left carousel-control" style="background-image: linear-gradient(to right, rgba(255, 170, 102, 1) 0px, rgba(255, 170, 102, 0) 100%);" href="#carousel-example-generic" role="button" data-slide="prev">' +
			    '<span class="glyphicon glyphicon-chevron-left"></span>' +
			  '</a>' +
			  '<a class="right carousel-control" style=" background-image: linear-gradient(to right, rgba(255, 170, 102, 0) 0px, rgba(255, 170, 102, 1) 100%);" href="#carousel-example-generic" role="button" data-slide="next">'+
			   '<span class="glyphicon glyphicon-chevron-right"></span>' +
			  '</a>' +
			'</div>'
		),

		events: {
			'click #startbtn' : 'request'
		},

		initialize: function  (options) {

		},

		render: function () {
			this.$el.html(this.template);
			return this;
		}

	});

})(jQuery);