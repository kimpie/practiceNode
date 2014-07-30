var app = app || {};

(function ($) {
        'use strict';

	app.newGameSetup = Backbone.View.extend({

		template: Handlebars.compile(

		'<div  id="newGameSetup">' +
			'<div class="row">'+
				'<div class="col-md-8 col-md-offset-2" style="text-align:center"id="title">' +
					'<h3>Invite friends to fib</h3>' +
				'</div>'+
				'<div class="col-md-1 col-md-offset-1">'+
					'<button type="button" aria-hidden="true" class="close">&times;</button>' +
				'</div>' +
			'</div>' +
			/*'<div class="row">' +
				'<div class="col-md-12 qtitle" id="placetitle"></div>' +
			'</div>' +
			'<div class="row">' +
				'<div id="place" class="col-md-12 question">' +
				   	'<section class="col-xs-12 col-md-6 select" id="placetitle" style="background-color: #658DF3;"><h3>Play Online</h3></section>' +
				   	'<section class="col-xs-12 col-md-6 select" id="placetitle" style="background-color: #53F1F1;"><h3>Play Face to Face</h3></section>' +
				'</div>' +
			'</div>' +
			'<div class="row">' +
				'<div id="peopletitle" class="col-md-12 qtitle"></div>' +
			'</div>' +
			'<div class="row">' +
				'<div id="people" class="col-md-12 question" style="display:none;">' +
					'<section class="col-xs-12 col-md-6 select" id="peopletitle" style="background-color: #53F1F1;"><h3>In a Group</h3></section>'+
					'<section class="col-xs-12 col-md-6 select" id="peopletitle" style="background-color: #658DF3;"><h3>One-on-One</h3></section>'+
				'</div>' +
			'</div>' +*/
			'<div class="row" id="qrow">'+
				'<div class="col-xs-12 col-md-10 col-md-offset-1">'+
				    '<input class="form-control input-lg" type="text" name="q" id="query" placeholder="Search for friends"/> ' +
				'</div>' +
				'<div class="col-xs-12 col-md-10 col-md-offset-1">' +
				  '<em>Click on a friend to add them to a game.</em>' +
				'</div>' +
			'</div>' +
			'<div class="row" style="margin: 0 0 5px 5px;" id="mfsContainer">' +
				    '<div class="col-xs-12 col-md-12" id="mfs"></div>' +
			'</div>' +
			'<div class="row deselectedlO" id="sendInvite" style="vertical-align: middle; margin: 0px;">' +
				'<div class="col-xs-12 col-md-12" style="color:white;"">' +
					'<em>Click on a friend to remove them from the game.</em>' +
				 '</div>' +
				'<div class="col-xs-12 col-md-12">' +
			      	'<div id="listInvitees" style="display:inline; text-align:left;">' +
					'</div>'+
				'</div>' +
				'<div class="col-xs-12 col-md-12">' +
					'<div class="sendInv" id="nosend"><h3>Start Fibbing</h3></div>'+
				'</div>' +
			'</div>' +
		'</div>'

	),

	events: {
		'click .close' : 'closeSetup',
		'click .qtitle' : 'qtitle',
		'click .select' : 'select',
		'click .media' : 'fb_checked',
		'click #sendInv' : 'sendInvites',
		'click #query' : 'clearbox'
	},

	initialize: function  (options) {
		console.log(options);
		this.collection = options.collection;
		this.gametype = options.gametype;
		console.log(this.gametype);
		console.log('newGameView has been initialized');
		this.listenTo(this.collection, "change", this.render);
		var gomfs = this.MFS();
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
        var style = info.currentTarget.style;
        var txt = info.currentTarget.innerHTML;
        console.log(info.currentTarget);
        console.log('style is ');
        console.log(style);
        $('div#' + id).html('<h3>' + txt + '</h3>');
        $('section#' + id).parent().hide();
        console.log('div id parent to hide is ' + id);
        //if the next div has no text AND its title is qtitle = go there 
        //else go to mfs  
        var textlength = $('div#' + id).parent().next().next().children().text().trim().length;
        var attrclass = $('div#' + id).parent().next().next().children().attr('class');
        if(attrclass.split(' ')[1] == 'qtitle' && textlength == 0){
        	console.log('going into group on one on one');
    		$('div#' + id).parent().next().next().next().children().show();
    	}else{
    		console.log('going to mfs');
    		this.MFS();
    		$('div#qrow').show();
    		$('div#qrow').next().show();
    	};
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
		console.log(info.currentTarget);
		var id = info.currentTarget.id;
		var k = $('div#' + id);
		console.log(k);
		if ( k.parent().attr('id') == 'listInvitees' ){
			$('#mfsForm').append(k);
			if($('#listInvitees').is(':empty')){ 
				$('.sendInv').attr('id', 'nosend');
				$('#sendInvite').attr('class', 'row deselectedlO');
			}
		} else {
			$('#sendInvite').attr('class', 'row lightOrange');
			$('.sendInv').attr('id', 'sendInv');
			$('#listInvitees').append(k);
		}
		/*if ( $('div#' + id).children('input').prop('checked') ){
			$('#sendInvite').show();
			$('#listInvitees').append(k);
		} else {
		    $('#mfsForm').append($('div#' + id));
		}*/
	},

	sendInvites: function(){
		// Get the list of selected friends
		var sendUIDs = '';
		var li = $('#listInvitees div.media > section');
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
			title: 'fibs game request',
			message: 'Play fibs with me!',
		}, callback);
		var pla = $('div#placetitle').text().split(' ').length;
		/*if(pla == 2){
			var place = $('div#placetitle').text().split(' ')[1];
			console.log('place is ' + place);
		} else {
			var place = 'Live';
			console.log('place is ' + place);
		}*/
		var ppl = $('div#peopletitle').text().split(' ').length;
		if(ppl == 1){
			var people = $('div#peopletitle').text();
		} else {
			var people = $('div#peopletitle').text().split(' ')[2];
		}
		var place = 'Online';
		var gt = this.gametype;
		var ginfo = [place, gt];
		console.log(ginfo);
		console.log(sendUIDs);
		var that = this;
		function callback(response) {
			that.collection.createGame(response, ginfo);
		};

	},

	MFS: function(){
		$('#mfsForm').load(function(){
			console.log('mfsForm all loaded?');
		});
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
				 friendItem.innerHTML = '<section style="display:inline;" id="fb_checkbox" value="'	
				 + response.data[i].id + '" />' 
				 + '<a id="fb_pic" href="#"><img class="media-object img-rounded" style="display:inline;"src="' + response.data[i].picture.data.url +  '"></a><h4 style="display:inline;">'
				 + response.data[i].name + '</h4>'; 
				 /*'<input style="display:inline;" id="fb_checkbox" type="checkbox" name="friends" value="'	
				 + response.data[i].id + '" />' 
				 + '<a id="fb_pic" href="#"><img class="media-object img-rounded" style="display:inline;"src="' + response.data[i].picture.data.url +  '"></a><h4 style="display:inline;">'
				 + response.data[i].name + '</h4>';*/
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
							    $('#' + sq).css({'background-color':'#53F1F1'});
							    
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