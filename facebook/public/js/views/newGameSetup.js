var app = app || {};

(function ($) {
        'use strict';

	app.newGameSetup = Backbone.View.extend({

		template: Handlebars.compile(

		'<div class="well" id="newGameSetup">' +
			'<div class="row">'+
				'<div class="col-md-8 col-md-offset-2" style="text-align:center"id="title">' +
					'<h3>Setup your Fib</h3>' +
				'</div>'+
				'<div class="col-md-1 col-md-offset-1">'+
					'<button type="button" aria-hidden="true" class="close">&times;</button>' +
				'</div>' +
			'</div>' +
			'<div class="row">' +
				'<div class="col-md-12 qtitle" id="placetitle"></div>' +
			'</div>' +
			'<div class="row">' +
				'<div id="place" class="col-md-10 col-md-offset-1 question">' +
				  	'<h4>Are you playing this Fib</h4>' +
				   	'<button type="button" class="btn btn-primary btn-lg select" id="placetitle" style="display:inline;">Online</button>' +
				  	'<h4 style="display:inline;">Or</h4>' +
				   	'<button type="button" class="btn btn-primary btn-lg select" id="placetitle" style="display:inline;">Live</button>' +
				'</div>' +
			'</div>' +
			'<div class="row">' +
				'<div id="peopletitle" class="col-md-12 qtitle"></div>' +
			'</div>' +
			'<div class="row">' +
				'<div id="people" class="col-md-10 col-md-offset-1 question" style="display:none;">' +
					'<h4>Fibbing with a</h4>' +
					'<button type="button" style="display:inline;" class="btn btn-primary btn-lg select" id="peopletitle">Group</button>' +
					'<h4 style="display:inline;">Or</h4>' +
					'<button type="button" class="btn btn-primary btn-lg select" id="peopletitle" style="display:inline;">One-on-One</button>' +
				'</div>' +
			'</div>' +
			'<div class="row" style="display:none;">' +		      
				'<div class="col-md-12 friendSelector"><h4 style="text-align:center;">Invite Friends to Play Fib</h4></div>' +
			'</div>'+
			'<div class="row" style="display:none;">'+
				'<div class="col-md-12">'+
				    '<input class="form-control input-lg" type="text" name="q" id="query" placeholder="Search Friends"/> ' +
				'</div>' +
			'</div>' +
			'<div class="row" style="display:none;" id="mfsContainer">' +
				    '<div class="col-md-12" id="mfs"></div>' +
			'</div>' +
			'<div class="row" id="sendInvite" style="display:none; vertical-align: middle;">' +
				'<div class="col-md-8">' +
			      	'<div id="listInvitees" style="display:inline; text-align:left;">' +
				  		'<h4>Game with: </h4>' +
					'</div>'+
				'</div>' +
				'<div class="col-md-2">' +
					'<button type="button" class="btn btn-success btn-lg" id="sendInv">Send Game Requests</button>'+
				'</div>' +
			'</div>' +
		'</div>'

	),

	events: {
		'click .close' : 'closeSetup',
		'click .qtitle' : 'qtitle',
		'click .select' : 'select',
		'click #fb_checkbox' : 'fb_checked',
		'click #sendInv' : 'sendInvites',
		'click #query' : 'clearbox'
	},

	initialize: function  (options) {
		console.log(options);
		this.collection = options.collection;
		console.log('newGameView has been initialized');
		this.listenTo(this.collection, "change", this.render);
	},

	closeSetup: function(info){
		app.AppView.vent.trigger('home');
	    $('.qtitle').empty();
	    $('#query').val("");
	    $('div.media').find(':checked').each(function() {
		   $(this).removeAttr('checked');
		});
	},

	clearbox: function(){
		$('#query').val('');
	},

	select: function(info){
        var id = info.currentTarget.id;
        var txt = info.currentTarget.innerHTML;
        $('div#' + id).html('<h4>' + txt + '</h4>');
        $('button#' + id).parent().hide();
        if( $('button#' + id).parent().parent().next().children().text().trim().length == 0  ){
	        $('button#' + id).parent().parent().next().next().children().show();
        } else {
        	this.MFS();
        	$('button#' + id).parent().parent().nextAll(':lt(3)').show();
        }

	},

	qtitle: function(info){

		//Hide or show the next div after .qtitle
		var divId = info.currentTarget.id;
		var did = divId.substr(0,4);
		if( $('div#' + divId).parent().next().children().is(':hidden') ) {
			$('div#' + divId).parent().next().children().show();
			$('div.qtitle > div.question').not('div[id*=' + did +']').hide();
		} else {
			$('div#' + divId).parent().next().children().hide();
		}
	},

	fb_checked: function(info){
		
		var id = info.currentTarget.parentElement.id;
		var k = $('div#' + id);

		if ( $('div#' + id).children('input').prop('checked') ){
			$('#sendInvite').show();
			$('#listInvitees').append(k);
		} else {
		    $('#mfsForm').append($('div#' + id));
		}
	},

	sendInvites: function(){
		// Get the list of selected friends
		var sendUIDs = '';
		var li = $('#listInvitees input#fb_checkbox:checked');
	    for(var i = 0; i < li.length; i++) {
	         var k = li.length -1;
	        if(li[i] == li[k]){
		   	sendUIDs += li[i].attributes.value.value;  
		    } else {
		    sendUIDs += li[i].attributes.value.value + ',';
		    }
		}

		// Use FB.ui to send the Request(s)
		FB.ui({method: 'apprequests',
			to: sendUIDs,
			title: 'Play MadFibs with me!',
			message: 'Check out this Awesome Game!',
		}, callback);
		var place = $('div#placetitle').text();
		var people = $('div#peopletitle').text();
		var ginfo = [place, people];
		var that = this;
		function callback(response) {
			that.collection.startGameProcess(response, ginfo);
		};

	},

	MFS: function(){

		//Building a custom multi-friend selector
		 function renderMFS() {

		 // First get the list of friends for this user with the Graph API
			FB.api('/me/friends?fields=name,picture', function(response) {
				var container = document.getElementById('mfs');
				var mfsForm = document.createElement('form');
				mfsForm.id = 'mfsForm';

				// Iterate through the array of friends object and create a checkbox for each one.
				for(var i = 0; i < Math.min(response.data.length); i++) {
				 var friendItem = document.createElement('div');
				 var k = response.data[i].name.split(' ').join('_');
				 friendItem.id = k;
				 friendItem.className = "media";
				 friendItem.innerHTML = '<input style="display:inline;" id="fb_checkbox" type="checkbox" name="friends" value="'	
				 + response.data[i].id + '" />' 
				 + '<a id="fb_pic" href="#"><img class="media-object img-rounded" style="display:inline;"src="' + response.data[i].picture.data.url +  '"></a><h4 style="display:inline;">'
				 + response.data[i].name + '</h4>';
				 mfsForm.appendChild(friendItem);

				 }
				 if ( $('#mfs').is(':empty') ){
				 	container.appendChild(mfsForm);
				 }

		 			var divs = $( "#mfsForm > div" ).get();
					divs = jQuery.unique( divs );
					var str = $('#mfsForm > div')    .map(function() { return $(this).text(); }).get().join();
					var temp = new Array();
					temp = str.split(",");
					var options, a;
					jQuery(function(){
						a = $('#query').autocomplete({
							onSelect: function(value, data){ 
								var sq = $('#query').val().split(' ').join('_');
								$('#' + sq).get(0).scrollIntoView();
							    $('#' + sq).css({'background-color':'yellow'});
							},
							lookup: temp
						});
					});

				});
			};
						
		
		renderMFS();


	},

	something: function(){
		$(".close").click(function() {
		    $('.qtitle').empty();
		    $('#query').val("");
		    $('div.media').find(':checked').each(function() {
			   $(this).removeAttr('checked');
			});
		});
		if ( $('.qtitle').first().is(':empty') ){
			$('#place').show();
			$('.friendSelector').hide();
		}
		
	},

	render: function () {
		this.$el.html(this.template());
		return this;

	}

	});

})(jQuery);