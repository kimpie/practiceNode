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

	var display_id = function (name, currentUser) {
		var name = jQuery('<ul />').text(name + "  ");
		jQuery('#display_name').append(name);
	};

	
	var socket = io.connect('http://www.completethesentence.com/');
	//var socket = io.connect('http://localhost');


	socket.on('users', function (data){
		display_id(data.name, 'mine');
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

	jQuery('#chat_box').keypress(function (event) {
		if (event.which == 32) {
			socket.emit('chat', {message: jQuery('#chat_box').val()});
			jQuery('#chat_box').val('');
		}
	});

	jQuery('#chat_box').keypress(function (event) {
		if (event.which == 13) {
			socket.emit('chat', {message: jQuery('#chat_box').val()});
			jQuery('#chat_box').val('');
		}
	});
});
