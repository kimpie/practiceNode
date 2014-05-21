var app = app || {};

(function ($) {
 //       'use strict';

	app.AppView = Backbone.View.extend({
//------Initialize AppView by fetching the players collection and listening for events
//------from the router and the players collection upon login 
		initialize: function  (options) {
			console.log('AppView is initialized.');

			this.collection  = new app.Players();
			
			this.gameCollection = new app.Games();
			this.cc = new app.Contact();

			this.listenTo(app.AppRouter, 'playerOn', this.getLocation);
			this.listenTo(app.AppRouter, 'inGame', this.play);
			this.listenTo(app.AppRouter, 'contact', this.contact);

			app.AppView.vent.on('loggedin', this.getLocation, this);
			this.listenTo(this.collection, 'reset', this.render);

			app.AppView.vent.on('launchFetch', this.go, this);
			app.AppView.vent.on('removeGame', this.removeGame, this);
			app.AppView.vent.on('updatePoints', this.updatePoints, this);
			app.AppView.vent.on('newGameRequest', this.processResponse, this);
			app.AppView.vent.on('inviteFriends', this.requestDialog, this);
			app.AppView.vent.on('home', this.getLocation, this);
			app.AppView.vent.on('startGame', this.processResponse, this);
			//app.AppView.vent.on('liveGame', this.live, this);
			//app.AppView.vent.on('onlineGame', this.online, this);

			this.userName = this.$('#userName');
			this.main = this.$('#main');	
			this.home = this.$('#home');
			this.share = this.$('#share');
			this.game = this.$('#game');
			this.play = this.$('#play');
			this.mfs = this.$('#mfs');
		},

		//------Two events, when a user logs in to FB and when they invite friends to join
		events: {
			"click #login": "loginPlayer",
			"click #btn-success": "requestDialog",
			"click #home": "homeView",
			"click #contact" : "contact"

		},

		/*live: function(){
			var lg = new app.liveGame();
			this.play.html(lg.render().el);
		},

		online: function(){
			var og = new app.onlineGame();
			this.play.html(og.render().el);
		},*/

		version: function(){
			var vv = new app.versionView();
			this.play.html(vv.render().el);
		},

		contact: function(){
			var cm = new app.contactModel();
			var cv = new app.contactView({model: cm});
			this.game.html(cv.render().el);
		},

		getLocation: function(playerid){
			//this.showPlayer(playerid);
			var player = this.collection.findWhere({fb_id: Number(currentUser)});			
			var url = location.hash.slice(10).split('/');
			var g = "";
			function games( element, index, array ){       
                 if (element == "games"){ 
					console.log('true');                     
					g = true;  
                 }
            };
            url.forEach(games);
			if (g){ 
				var game = url[2];
				this.play(game);
			} else {
				console.log('player from getLocation');
				console.log(player);
				this.showPlayer(player);
			} 

		},

/*		homeView: function(player){
			if (player == undefined){
				var player = location.hash.slice(9);
				var playermodel = this.collection.get(player);
			} else if (typeof player == "object"){
				var playermodel = player;
			} else if (typeof player == "string"){
				if (player.length > 27){
					var player = location.hash.slice(9);
				} else {
					var player = player;
				}
				var playermodel = this.collection.get(player);
			}
			var hv = new app.homeView({model: playermodel});
			this.game.html(hv.render().el);
			var ShareView = new app.shareView({model: playermodel});
			this.share.html(ShareView.render().el);		
		},
*/
		voteView: function(){
		//Creating the code to loop through the collection, randomly pull out a model 
		//and then send that model to the voteView, every 30 seconds.
		var gid = this.gameCollection.where({complete:true, share: true});
		
		var that = this;
		//fn that takes a collection and returns a model
		function grabmodel(collection){
			var model = that.gameCollection.get(collection[Math.floor(Math.random() * collection.length)]);
			return model;
		};	
		var randoModel = grabmodel(gid);
		var voteView = new app.VoteView({model: randoModel});
		this.nested.html(voteView.render().el);
		
		},

		go: function(player, pcGames){
			var player = player;
			var pcGames = pcGames;
			var that = this;
			this.gameCollection.fetch({reset:true, 
				success: function(){ 
					app.AppView.vent.trigger('checkForGames', player, pcGames);
					that.getLocation(player.id);
				}
			});
		},

		updatePoints: function(fbid, points){
			var player = this.collection.findWhere({fb_id: Number(fbid)});
			app.AppView.vent.trigger('updatePlayer', player, points);
		},

		removeGame: function(model, player){
			var gameModel = model;
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
			app.AppView.vent.trigger('modelRemove', gameModel, player);
		},

		showAllPoints: function(player){
			this.points.html('<h4>Total Points</h4>' +  '\n<h3><strong>' + player.attributes.points) + '</strong></h3>';
		},

//------Upon login, showPlayer receives the player model and initializes the PlayersView
		showPlayer: function(player) {
			console.log('player from showPlayer');
			console.log(player);
			if (player == undefined){
				var player = location.hash.slice(9);
				var playermodel = this.collection.get(player);
			} else if (typeof player == "object"){
				var playermodel = player;
			} else if (typeof player == "string"){
				if (player.length > 27){
					var player = location.hash.slice(9);
				} else {
					var player = player;
				}
				var playermodel = this.collection.get(player);
			}

			var playerView = new app.PlayersView({model: playermodel});
            this.main.html(playerView.render().el);
            
			//this.home.html('<a type="button" class="btn btn-default btn-lg" id="home" href="/facebook/#players/'+ playermodel.id + '"><span class="glyphicon glyphicon-home"></span></a>');

		},

//------Upon friend invite to start game, play receives game model and pass it to games view
//------to initialize, if player 1 is logged in gameview opens, if player 2 gameview 2.
		play: function(game){
			var game_model = this.gameCollection.findWhere({_id: game});
			if (game_model.attributes.player1 == Number(currentUser)){
				var gameview = new app.GamesView({model: game_model});
				this.play.html(gameview.render().el);
				//var ShareView = new app.shareView({model: game_model});
				//this.share.html(ShareView.render().el);
			} else {
				var gameview2 = new app.GamesView2({model: game_model});
				this.play.html(gameview2.render().el);	
				//var ShareView = new app.shareView({model: game_model});
				//this.share.html(ShareView.render().el);			
			}
		},

//------Once FB registers the player has logged in, they trigger the click on loginPlayer
//------for our database to find or register the player.
		loginPlayer: function (){
			var that = this;
			this.collection.fetch({reset:true, 
				success: function(collection){ 
					collection.loginPlayer();
				}
			});
		},

//------FB api used to invite friends to play game.
		requestDialog: function(){
			var ngv = new app.newGameView();
			this.play.html(ngv.render().el);
		},
/*			$(".close").click(function() {
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

			function sendRequest() {
			// Get the list of selected friends
				var sendUIDs = '';
				var mfsForm = document.getElementById('mfsForm');
				for(var i = 0; i < mfsForm.friends.length; i++) {
					if(mfsForm.friends[i].checked) {
						 sendUIDs += mfsForm.friends[i].value + ',';
					}
				}

				// Use FB.ui to send the Request(s)
				FB.ui({method: 'apprequests',
					to: sendUIDs,
					title: 'Play MadFibs with me!',
					message: 'Check out this Awesome Game!',
				}, callback);
			};

			function callback(response) {
				console.log(response);
			};

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
					 var k = response.data[i].name.replace(' ', '_');
					 friendItem.id = k;
					 friendItem.className = "media col-md-12";
					 friendItem.innerHTML = '<input style="display:inline;" type="checkbox" name="friends" value="'	
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
									var sq = $('#query').val().replace(' ', '_');
									$('#mfs').animate({
								        scrollTop: $('#' + sq).offset().top
								    }, 2000);
								    $('#' + sq).css({'background-color':'yellow'});
								},
								lookup: temp
							});
						});

					});
				};

				//once a button is selected, hide the div
				$('.select').each(function(){
					$(this).click(function(){
				        var id = $(this).attr('id');
				        var txt = $(this).text();
						console.log('id: ' + id + ' and text : ' + txt);
				        $('div#' + id).html('<h4>' + txt + '</h4>');
				        $(this).parent().hide();
				        if( $(this).parent().next().text().trim().length == 0  ){
					        $(this).parent().nextAll('.question').show();
				        } else {
				        	$(this).parent().nextAll('.friendSelector').show();
				        }
					});
				});
				// Create a button to send the Request(s)
				 var sendButton = document.createElement('input');
				 sendButton.type = 'button';
				 sendButton.className = 'btn btn-default';
				 sendButton.value = 'Send Game Invite';
				 sendButton.onclick = sendRequest;
				
				var getChecked = function() {
					var k = $( "input:checked" ).parent();
					if ( $(this).prop('checked') ){
						$('#listInvitees').append(k);
					} else {
					    $('#mfsForm').append($(this).parent());
					}
				};

				$( "input[type=checkbox]" ).on( "click", getChecked );
				
				//Hide or show the next div after .qtitle
				$( '.qtitle' ).each(function(){
					$(this).click(function() {
						var divId = $(this).attr('id');
						var did = divId.substr(0,4);
						if( $('div#' + divId).next().is(':hidden') ) {
							$('div#' + divId).next().show();
							$('div.modal-body row').not('div[id*=' + did +']').hide();
						} else {
							$('div#' + divId).next().hide();
						}
					});	
				});
			
			renderMFS();
		/*	$("div.media input:checkbox:checked").each(function(){
				$('#listInvitees').append($(this).parent());	
			});
		    

     		//Show send button when all fields are complete
			var checked = [],
				qtNotEmpty = !($('.qtitle' ).is(':empty'));
			$("#mfs input:checkbox:checked").each(function() {
			    checked.push($(this)); 
			});
			if (qtNotEmpty && checked.length != 0){
			    $('#sendInvite').append(sendButton);	    
			}
		

			//this.mfs.perfectScrollbar();
			
/*			FB.ui({method: 'apprequests',
		     message: 'Play MadFib with me!' 
		    }, requestCallback);
			var that = this;
		    function requestCallback(response){
		    	that.processResponse(response);
		    };
*/

/*		startGroup: function (){
			FB.ui({method: 'apprequests',
		     message: 'Play MadFib with me!' 
		    }, requestCallback);
			var that = this;
			var group = 'group';
		    function requestCallback(response){
		    	that.processResponse(response , game);
		    };
		},	

		startOne: function(){
			FB.ui({method: 'apprequests',
		     message: 'Play MadFib with me!' 
		    }, requestCallback);
			var that = this;
			var one = 'one';
		    function requestCallback(response){
		    	that.processResponse(response, one);
		    };
		},
*/
		processResponse: function(response, ginfo){
			var response = response,
				ginfo = ginfo;
			console.log('processResponse received: ');
			console.log(response);
			console.log(ginfo);

			var place = ginfo[0];
			var people = ginfo[1];

			if (people == "Group"){
				//handle group game setup
				var gameinfo = {
					player2to: Number(to),
					p2name: info.name,
					p1url: x,
					p2url: p2id
				}
				gcollection.createGame(gameinfo);
			} else {
				//handle one-one-one game setup; will be same as previously just different fields

			}
/*
	//	}
//--------PART 1: Need both player and game inforamtion to create game with.

			//Get the logged-in player's information, the one who has created the game.
			var player = this.collection.findWhere({fb_id: Number(currentUser)});
	  		var x = player.id;

	  		//Get all of the data for games ongoing.
			var gcollection = this.gameCollection;
			this.gameCollection.fetch({reset:true});
			var that = this;
			var pcollection = this.collection;
	
		  //	function requestCallback (response){
		  		
		  		if (response.to !== undefined) {
	  			
		  			var to = response.to;
		  			function createGame(to){
						var p2n = String(to);

						function assignGameData(info){
							var player2 = pcollection.findWhere({fb_id: Number(to)});
							if (player2 != undefined){
								var p2id = player2.id;
							} else {
								var p2id = undefined;
							}

							//See if any games already exist between the two players.
							var match = {};
							function checkGame(info){
								var t = gcollection.findWhere({player1: Number(to), player2: Number(currentUser), active: true});
								var s = gcollection.findWhere({player1: Number(currentUser), player2: Number(to), active: true}); 
								if (t){
									var match = t;
								} else if (s) {
									var match = s;
								} else {
									var match = undefined;
								}
								if (match != undefined){
									var active = true;
								} else {
									var active = false;
								}
								return active;
							};

							var ifActive = checkGame(info);
							//See if any games already exist between the two players.
							if (ifActive) {
								console.log('This game already exists.');
								app.AppRouter.navigate('/players/' + x + '/games/' + match.attributes.id, true);
							} else {
							
								var gameinfo = {
									player2to: Number(to),
									p2name: info.name,
									p1url: x,
									p2url: p2id
								}
								gcollection.createGame(gameinfo);
							} // end of else matched game
						}; //End of assignGameData fn

						FB.api(p2n, function (info){
							
					  			assignGameData(info);
				
						}); //End of FB.api function	
					}; //End of fn createGame

//------------------Logic for creating games when multiple friends have been invited. 
		  			if (response.to.length > 1){
		  				var friends = response.to;
		  				for (var i = 0; i < friends.length; i++){
		  					createGame(friends[i]);
		  				}
		  			} else {
		  				createGame(response.to);
		  			}//End of response.to length if/else 

			  	} // End of if response.to 
			  	else {
			  		//socket.emit('join', {status: 'not_joined'});
					console.log('No player selected, response is ' + response.to);
		  		} //End of else response.to
			//};  //End of function requestCallback
*/
		}



	});
//----vent used as the Applications event aggregator.
	app.AppView.vent = _.extend({}, Backbone.Events);

})(jQuery);

