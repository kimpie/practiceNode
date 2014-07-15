jQuery(document).ready(function () {
	var log_chat_message = function (word) {
		console.log('lcm recieved ' + word);
		var w = word + ' ';
		jQuery('#storyText').append(w);
	};

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

	socket.on('update', function (data){
		console.log('inside chatter on update with room: ' + data.room);
		app.AppView.vent.trigger('updatePlayer', data);
	});

	socket.on('chat', function (data) {
		//end(data);
		//app.AppView.vent.trigger('saveNewSentence', data);
		console.log('inside chatter chat to updatePlayer');
		if(data.place == 'Live'){
			if(data.round == 'complete'){
				app.AppView.vent.trigger('ab', data);
			} else {
				console.log('sending to log_chat_message with ' + data.word);
				log_chat_message(data.word);
			}
		} else {
			app.AppView.vent.trigger('ab', data);
		}
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
