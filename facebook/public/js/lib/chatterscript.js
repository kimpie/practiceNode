jQuery(document).ready(function () {
	var log_chat_message = function (message) {

		var k = message;		
/*		if (type === 'system') {
			k.css({'font-weight': 'bold'});
		}	
		else if (type === 'leave') {
			k.css({'font-weight': 'bold', 'color': '#F00'});
		}
		else {
			k.css({'display': 'inline'});
		}	*/
		//jQuery('#chat_log').append(li);
		jQuery('#display_word').append(k);
	};

	var start = function (pre_msg){
		var j = pre_msg;
		jQuery('#waiting').append(j);
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

	socket.on('entrance', function (data){
		log_chat_message(data.message, 'system');
	});

	socket.on('exit', function (data) {
		log_chat_message(data.message, 'leave');
	});

	socket.on('chat', function (data) {
		log_chat_message(data.message, 'normal');
//		app.AppView.vent.trigger('saveNewSentence', data.message);
	});

	socket.on('example', function (data) {
		app.AppView.vent.trigger('example', data.test);
	});

	socket.on('ready', function (data){
		log_chat_message(data.message);
	});

	socket.on('joined', function (data){
		start(data.pre_msg);
	});

	socket.on('message', function (data){
		log_chat_message(data.message);
	});

});
