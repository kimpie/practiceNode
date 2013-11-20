<html>
<head>
<script src="http://www.completethesentence.com/socket.io/socket.io.js"></script>
<script src="1.7.2.jquery.min.js"></script>
<script src="./facebook/js/myscript.js"></script>
<script type="text/javascript" charset="utf-8">
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
		var name = jQuery('<li />').text(name + "  ");
		var myname = jQuery('<li />').text(currentUser + "  ");
		if (currentUser === 'mine'){
			name.css({'display': 'inline', 'font-weight': 'bold'});
		}
		else {
			name.css({'display': 'inline'});
		}
		jQuery('#display_name').append(name);
	};

	
	var socket = io.connect('http://www.completethesentence.com/');

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
/*$("document").ready(function () {
	var li = jQuery('<li />').text(message);
	$("li:contains(config.username)").css("text-decoration", "underline");

});*/

</script>
<style type="text/css" media="screen">
	.loggedoff {
		display: block;
	}

	.loggedin {
		display: none;
	}
	
	div#chatroom {
		display: block;
		height: 300px;
		border: 1px solid #999;
		overflow: auto;
		width: 100%;
		margin-bottom: 10px;
		position: relative;
	}

	div#display_name {
		display: block;
		background-color: blue;
		height: 100px;
		border: 1px solid #000;
		border-radius: 10px;
		border-bottom: 0px;
		overflow: auto;
		width: 100%;
		padding: 10px;
		padding-top: 0px;
		margin-bottom: 10px;
		position: relative;
	}

	ul#user_list {
		display: inline;
		list-style: none;
	}

	li#user_id {
		display: inline;
	}

	ul#chat_log {
		list-style: none;
		position: absolute;
		bottom: 0px;
		display: inline;
	}

	li#chat_li {
		display: inline;
	}

	input#chat_box {
		width: 99%;
	}
</style>
</head>
<body>
	<div id="fb-root"></div>
	<div id="content">
		<div class="loggedoff">
			<p>Welcome, you're not logged in.  To start please<a href="#" onclick="goLogIn()">Login</a></p>
		</div>
		<div class="loggedin">
			<p>Welcome!  Thanks for visiting our App.</p> 
		</div>
	</div><!--content-->
	<div id="display_name">
		<h3>Current players:</h3>
		<ul id="user_list">
		<li id="user_id"></li>
		</ul>
	</div>

	<div id="chatroom">
		<ul id="chat_log">
		<li id="chat_li"></li>
		</ul>
	</div>

	<input type="text" name="chat_box" value="" id="chat_box" placeholder="type to chat..." />
</body>
</html>