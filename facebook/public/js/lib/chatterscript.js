jQuery(document).ready(function () {

	var end = function(data){
		if (data.end){
			if (data.klen == 'least'){
				//jQuery('body').css({'background-image': 'url(https://i.imgur.com/lIKqQfn.png)'});
				jQuery('#gameover').append('<h3><strong>Oh no, the Fib was too short!  The wolf knew it was a lie and has taken a sheep. Game Over.</strong></h3>');
			} else if (data.klen == 'middle'){
				//jQuery('body').css({'background-image': 'url(https://i.imgur.com/cIJegF9.png)'});
				jQuery('#gameover').append('<h3><strong>You\'ve Told a Mighty Fine Fib and diverted the wolf! Game Over.</strong></h3>');
			} else if (data.klen == 'most'){
				//jQuery('body').css({'background-image': 'url(https://i.imgur.com/lPdf4Vp.png)'});
				jQuery('#gameover').append('<h3><strong>You\'ve Told the best Fib!  All of the sheep are safe from the wolf! Game Over.</strong></h3>');
			}
		} 
	};

	/*var notify_turn = function(turn){

		var select_game = li.href.slice(41);

		if ( Number(currentUser) == turn ) {
			$( "#player_name" ).addClass( "btn btn-primary" );
		} else {
			$( "#player_name" ).removeClass( "btn btn-primary" );
		}

	};*/

	var start = function (message){
		var j = message;
		jQuery('#waiting').append(j);
	};
	var notify = function(pReqting){
		console.log('notify triggered with ' + pReqting + ' asking for a new game.');
		jQuery('#notify').append('<div class="alert alert-warning"><p class="lead">'  + pReqting + ' would like to start a new game with you.</p><button type="button" class="btn btn-primary btn-lg" id="notifybtn">Let\'s do it!</button></div>');
	    //jQuery('#notifybtn').append('<button type="button" class="btn btn-primary btn-lg">Let\'s do it!</button>');
	};
	/*var display_id = function (name) {
		var name = jQuery('<ul />').text(name + " ").css({'display': 'inline'});
		jQuery('#display_name').append(name);
	};*/

	socket = io.connect('https://completethesentence.com/', {secure: true , resource:'facebook/socket.io'});
//	socket = io.connect('http://localhost:8080/', { resource:'facebook/socket.io'});

	/*socket.on('users', function (info){
		display_id(info.name);
	});*/
	socket.on('end', function (data) {
//		log_chat_message(data.message, 'normal');
		//notify_turn(data.turn);
		end(data);
	});

	socket.on('entrance', function (data){
		log_chat_message(data.message, 'system');
	});

	socket.on('exit', function (data) {
		log_chat_message(data.message, 'leave');
	});

	socket.on('chat', function (data) {
		end(data);
		app.AppView.vent.trigger('saveNewSentence', data);
	});

	socket.on('newGameRequest', function (data) {
		notify(data.pReqting);
		app.AppView.vent.trigger('request', data);
	});

	socket.on('example', function (data) {
		app.AppView.vent.trigger('example', data.test);
	});

	socket.on('ready', function (data){
		log_chat_message(data.message);
	});

	socket.on('joined', function (data){
		start(data.message);
	});

	socket.on('message', function (data){
		log_chat_message(data.message);
	});

});
