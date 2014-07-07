var chatter = require('chatter'),
        express = require('express'),
        app = module.exports = express(),
        multiparty = require('connect-multiparty'),
        fs = require('fs'),
        MongoStore = require('connect-mongo')(express);

var mongoose = require('mongoose');
var uri = 'mongodb://nodejitsu_kapienta:u62qdrfun7e30jeq9m1onp3qq8@ds045978.mongolab.com:45978/nodejitsu_kapienta_nodejitsudb4870797025';
global.db = mongoose.createConnection(uri);
fillinblank = 'ad8d386b72151909021d28d0830c6c72';

var http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server, {
      resource: '/facebook/socket.io'
    });

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'localhost:8080/ http://completethesentence.com https://www.completethesentence.com/ https://completethesentence.com https://completethesentence.com/facebook/ https://www.completethesentence.com/facebook/socket.io/ https://completethesentence.com/facebook/socket.io/1/ https://www.completethesentence.com/facebook/socket.io/1/ http://completethesentence.com/socket.io https://facebook.com /facebook/socket.io/socket.io.js');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

    next();
};

app.configure(function(){
        app.set('view engine', 'handlebars');
        app.use(multiparty());
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.cookieParser());
        app.use(express.session({ 
                key: 'express.sid', 
                secret: 'secret',
                store: new MongoStore({ 
                        url: 'mongodb://nodejitsu_kapienta:u62qdrfun7e30jeq9m1onp3qq8@ds045978.mongolab.com:45978/nodejitsu_kapienta_nodejitsudb4870797025' 
                })
        }));
        app.use(express.methodOverride());
        app.use(allowCrossDomain);
        app.use("/facebook",express.static(__dirname + '/public'));
});


app.configure('development', function(){
       app.use(express.errorHandler());
});


var api = require('./controllers/api.js');

app.get('/', function (req, res){
  res.redirect('/facebook/');
});

app.get('/facebook/', function (req, res, next){
    fs.readFile('public/index.html', 'utf8', function(err, html){
        res.send(html);
    });
    next();
});

app.post('/facebook/', function (req, res){
    fs.readFile('public/index.html', 'utf8', function(err, html){
        res.send(html);
    });
});


app.get('/facebook/players', api.getPlayers);
app.get( '/facebook/players/:id', api.getPlayer);
app.post('/facebook/players', api.postPlayer);
app.put('/facebook/players', api.updatePlayer);
app.put('/facebook/players/:id', api.updatePlayer);

app.get('/facebook/players/:playerid/games', api.getGames);
app.post('/facebook/players/:playerid/games', api.postGame);
app.get('/facebook/players/:playerid/games/:id', api.getGame);
app.put('/facebook/players/:playerid/games/:id', api.updateGame);
app.post('/facebook/players/:playerid/games/:id', api.postGame);

app.post('/facebook/contact', api.postContact);
app.get('/facebook/players/:playerid/games/:id/round/:rid/cards', api.getCards);

//app.delete( '/facebook/players/:playerid/games/:id', api.deleteGame); 

/*  socket.on('addGame', function (data){
    //socket.room = data.room;
    //socket.p1 = data.p1;
    //socket.p2 = data.p2;
    socket.join(data.room, function (data){
      socket.broadcast.to(data.room).emit('joined', {pre_msg: currentUser + " is ready to play!"});
    });
  });

/*  socket.on('join', function (data){
    socket.emit('join', {status: data.status});

    socket.join('room', function (data){
      socket.broadcast.to('room').emit('joined', {message: 'Game is on!'});
    });//end of 'room'
  });//end of join
  */
//}); //end of 'connection'

var chat_room = io;

chat_room.set('production', function(){
  chat_room.set('transports', 
    [
    'websocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
    ]);
});

  chatter.set_sockets(chat_room.sockets);

  chat_room.sockets.on('connection', function (socket) {
          chatter.connect_chatter({
                  socket: socket,
                  username: socket.id
          });
 
  });


/*app.delete('/players/:player_name', function  (req, res) {

  var found = false;

  player.forEach(function (player, index) {
    if (player.url === req.params.player_name) {
      found = index;
    }
  });

  if (found) {
    player.splice(found, 1);
    res.json(200, {status: 'deleted'});
  } else {
    res.json(404, {status: 'invalid player name'});
  }

});*/

app.get('/*', function  (req, res) {
  res.json(404, {status: 'not found'});
});

server.listen(
// 8080, function (){
//  console.log('Server listening on port 8080');
//}
);