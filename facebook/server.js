var chatter = require('chatter'),
        express = require('express'),
        app = express(),
        //fs = require('fs'),
        inGame = require('./data/inGame');
        //beforeGame = require('./data/beforeGame.json');

var http = require('http'),
        server = http.createServer(app);
        io = require('socket.io').listen(server);

app.configure(function(){
        //app.set('port', 8080);
        //app.set('views', __dirname + '/views');
        //app.set('view engine', 'jade');
//        app.locals.pretty = true;
//        app.use(express.favicon());
//        app.use(express.logger('dev'));
        app.use(express.bodyParser());
//        app.use(express.cookieParser());
//        app.use(express.session({ 
//                key: 'express.sid', 
//                secret: 'secret',
//                })
//        );
//        app.use(express.methodOverride());
        //app.use(require('stylus').middleware({ src: __dirname + '/public' }));
        app.use(express.static('public'));
});

//app.configure('development', function(){
 //       app.use(express.errorHandler());
//});

app.get('/inGame', function  (req, res) {
  res.json(inGame);
});

app.post('/inGame', function  (req, res) {
  var matches = inGame.filter(function  (game) {
    return game.url === req.body.url;
  });

  if (matches.length > 0) {
    res.json(409, {status: 'item already exists'});
  } else {
    req.body.id = req.body.url;
    inGame.push(req.body);
    res.json(req.body);
  }

});

app.get('/inGame/:game_name', function  (req, res) {
  var matches = inGame.filter(function  (game) {
    return game.url === req.params.game_name;
  });

  if (matches.length > 0) {
    res.json(matches[0]);
  } else {
    res.json(404, {status: 'invalid game name'});
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

app.delete('/inGame/:game_name', function  (req, res) {

  var found = false;

  inGame.forEach(function (game, index) {
    if (game.url === req.params.game_name) {
      found = index;
    }
  });

  if (found) {
    inGame.splice(found, 1);
    res.json(200, {status: 'deleted'});
  } else {
    res.json(404, {status: 'invalid game name'});
  }

});

app.get('/*', function  (req, res) {
  res.json(404, {status: 'not found'});
});

server.listen(8080, function (){
  console.log('Server listening on port 8080');
});