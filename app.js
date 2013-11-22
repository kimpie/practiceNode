var chatter = require('chatter'),
	express = require('express'),
	app = express(),
	fs = require('fs');

var options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};

var	https = require('https'),
	//http = require('http'),
	server = https.createServer(options, app),
	io = require('socket.io').listen(server);

//var server = https.createServer(options, app);
//var app = connect().use(connect.static('public')).listen(3000);
//app.use(express.static(__dirname + '/public'));

app.configure(function(){
	app.set('port', 8080);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;
//	app.use(express.favicon());
//	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'super-duper-secret-secret' }));
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: __dirname + '/public' }));
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

require('./routes')(app);

var chat_room = io;

chatter.set_sockets(chat_room.sockets);

chat_room.sockets.on('connection', function (socket) {
	chatter.connect_chatter({
		socket: socket,
		username: socket.id
	});

});

server.listen();

