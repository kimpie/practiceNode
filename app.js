var chatter = require('chatter'),
	express = require('express'),
	app = express();
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server);



//var app = connect().use(connect.static('public')).listen(3000);
app.use(express.static('public'));

app.use(function(req,res) {
	if( req.url === "/facebook"){
		res.send('facebook');
	}
});

var chat_room = io;

chatter.set_sockets(chat_room.sockets);

chat_room.sockets.on('connection', function (socket) {
	chatter.connect_chatter({
		socket: socket,
		username: socket.id
	});

});

server.listen(8080);

