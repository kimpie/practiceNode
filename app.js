var chatter = require('chatter'),
        express = require('express'),
        app = express(),
        cookie = require('cookie'),
        connect = require('connect'),
        //db = require('./db'),
        mongoose = require('mongoose'),
        MongoStore = require('connect-mongo')(express),
        fs = require('fs');

var http = require('http'),
        //http = require('http'),
        server = http.createServer(app),
        io = require('socket.io').listen(server);

app.configure(function(){
        app.set('port', 8080);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.locals.pretty = true;
//        app.use(express.favicon());
//        app.use(express.logger('dev'));
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
        app.use(require('stylus').middleware({ src: __dirname + '/public' }));
        app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
        app.use(express.errorHandler());
});

require('./routes')(app);

// Configure global authorization handling. handshakeData will contain
// the request data associated with the handshake request sent by
// the socket.io client. 'accept' is a callback function used to either
// accept or reject the connection attempt.
// We will use the session id (attached to a cookie) to authorize the user.
// in this case, if the handshake contains a valid session id, the user will be authorized.
io.set('authorization', function (handshakeData, accept) {
    // check if there's a cookie header
    if (handshakeData.headers.cookie) {
        // if there is, parse the cookie
        handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
        // the cookie value should be signed using the secret configured above (see line 17).
        // use the secret to to decrypt the actual session id.
            handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');
            // if the session id matches the original value of the cookie, this means that
            // we failed to decrypt the value, and therefore it is a fake. 
        if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
                // reject the handshake
                return accept('Cookie is invalid.', false);
        }
    } else {
       // if there isn't, turn down the connection with a message
       // and leave the function.
       return accept('No cookie transmitted.', false);
    } 
    // accept the incoming connection
    accept(null, true);
}); //end of authorization

var chat_room = io;

chatter.set_sockets(chat_room.sockets);

chat_room.sockets.on('connection', function (socket) {
        chatter.connect_chatter({
                socket: socket,
                username: socket.id
        });
});

server.listen();