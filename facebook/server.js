var chatter = require('chatter'),
        express = require('express'),
        app = module.exports = express(),
        fs = require('fs'),
        //app = express(),
        //db = require('./mongoose'),
        MongoStore = require('connect-mongo')(express);
        //beforeGame = require('./data/beforeGame.json');
       // inGame = require('./data/inGame');
var mongoose = require('mongoose');
var uri = 'mongodb://nodejitsu_kapienta:u62qdrfun7e30jeq9m1onp3qq8@ds045978.mongolab.com:45978/nodejitsu_kapienta_nodejitsudb4870797025';
global.db = mongoose.createConnection(uri);

var http = require('http'),
        server = http.createServer(app);
        io = require('socket.io').listen(server);

app.configure(function(){
        app.set('view engine', 'handlebars');
        //app.enable('strict routing');
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.session({ 
                key: 'express.sid', 
                secret: 'secret',
                store: new MongoStore({ 
                        url: 'mongodb://nodejitsu_kapienta:u62qdrfun7e30jeq9m1onp3qq8@ds045978.mongolab.com:45978/nodejitsu_kapienta_nodejitsudb4870797025' 
                })
        }));
        app.use(express.methodOverride());
        app.use("/facebook",express.static(__dirname + '/public'));
});

app.configure('development', function(){
       app.use(express.errorHandler());
});


var api = require('./controllers/api.js');

app.get('/', function (req, res){
  res.redirect('/facebook/');
});

app.get('/facebook/', function (req, res){
    fs.readFile('public/index.html', 'utf8', function(err, html){
        res.send(html);
    });
});

app.post('/facebook/', function (req, res){
    fs.readFile('public/index.html', 'utf8', function(err, html){
        res.send(html);
    });
});

app.get('/players', api.getPlayers);
app.get( '/players/:id', api.getPlayer);
app.post('/players', api.postPlayer);
app.put('/players', api.updatePlayer);
app.put('/players/:id', api.updatePlayer);

app.get('/players/:playerid/games', api.getGames);
app.post('/players/:playerid/games', api.postGame);
app.get('/players/:playerid/games/:id', api.getGame);
app.put('/players/:playerid/games/:id', api.updateGame);
app.post('/players/:playerid/games/:id', api.postGame);


/*app.delete('/players/:id/:game', api.deleteGame);*/



io.sockets.on('connection', function (socket) {
  socket.on('join', function (data){
    socket.emit('join', {status: data.status});

    socket.join('room', function (data){
      socket.broadcast.to('room').emit('joined', {message: socket.id + ' is in the room.'});
    });//end of 'room'
  });//end of join
}); //end of 'connection'

  var chat_room = io;

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
//  8080, function (){
//  console.log('Server listening on port 8080');
//}
);

//Create a function to return the get url requested so that it will load every script tag
//did a test witht he css/style.css and it worked.