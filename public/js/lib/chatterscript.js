jQuery(document).ready(function () {
	var log_chat_message = function (message, type) {
		var li = jQuery('<li />').text(message);
		
		if (type === 'system') {
			li.css({'font-weight': 'bold'});
		}	
		else if (type === 'leave') {
			li.css({'font-weight': 'bold', 'color': '#F00'});
		}
		else {
			li.css({'display': 'inline'});
		}	
		jQuery('#chat_log').append(li);
	};

	var display_id = function (name) {
		var name = jQuery('<ul />').text(name + " ").css({'display': 'inline'});
		jQuery('#display_name').append(name);
	};

	socket = io.connect('https://completethesentence.com/');


	socket.on('users', function (info){
		display_id(info.name);
	});

	socket.on('entrance', function (data){
		log_chat_message(data.message, 'system');
	});

	socket.on('exit', function (data) {
		log_chat_message(data.message, 'leave');
	});

	socket.on('chat', function (data) {
		log_chat_message(data.message, 'normal');
	});

});
