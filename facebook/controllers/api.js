var Player = require('../mongoose_models/player.js');
var Game = require('../mongoose_models/game.js');
var Contact = require('../mongoose_models/contact.js');
var Card = require('../mongoose_models/card.js');

//------------------------------------------Player logic------------------------------------ 
//Find all players
exports.getPlayers = function (req, res){
	Player.find(function(err, players){
    res.send(players);
  });
};

//Find a player on login
exports.getPlayer = function (req, res){
	return Player.findById( req.params.id, function( err, player) {
        if( !err ) {
            return res.send( player );
            res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
        } else {
            return console.log( err );
        }

    });
};

// Create a new player on login

exports.postPlayer = function (req, res){
	    var player = new Player({
			fb_id: req.body.fb_id, 
			name: req.body.name,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			city: req.body.city,
			gender: req.body.gender,
			url: req.body.url,
		    last_login: req.body.last_login, 
		    points: req.body.points
		});
		player.save( function (err){
			if (err) return handleError (err);
			
			/*var game1 = new Game({
				game_id : req.body.game_id;
				player1: player._id
				player2: req.body.player2;
			});

			game1.save(function (err){
				if (err) handleError (err);
			});*/

		});
		return res.send(player);
	    //res.json(req.body);
	  //}
	 	
};

// Update player when new data comes in

exports.updatePlayer = function (req, res){
	console.log( 'Updating player ' + req.body.id );
    return Player.findById( req.params.id, function( err, player ) {
    	player.fb_id = req.body.fb_id; 
		player.name = req.body.name;
		player.first_name = req.body.first_name;
		player.last_name = req.body.last_name;
		player.city = req.body.city;
		player.gender = req.body.gender;
		player.url = req.body.url;
	    player.last_login = req.body.last_login;
        player.games = req.body.games;
        player.points = req.body.points;
        
	    return player.save( function( err ) {
	        if( !err ) {
	            console.log( 'player updated' );
	        } else {
	            console.log( err );
	        }
	       // Player.populate(player, {path: 'games.id', model: 'Game'}, function (err, player) {
	        //	console.log(player);
	        //})
	        
	    	return res.send( player );
	    });
    });
};


//---------------------------------------------Game logic------------------------------- 
// Find all games
exports.getGames = function (req, res){
	Game.find(function(err, games){
    res.send(games);
  });
};

//Find the game once selected
exports.getGame = function (req, res){
	return Game.findById( req.params.id, function( err, game) {
        if( !err ) {
            return res.send( game );
        } else {
            return console.log( err );
        }
    });
   
};

exports.postGame = function (req, res){
	    var game = new Game({
			game_id: req.body.game_id,
			complete: req.body.complete,
			active: req.body.active,
			round_turn: req.body.round_turn, 
			word_turn: req.body.word_turn,
			place: req.body.place,
			round: req.body.round,
			players: req.body.players,
			word_countdown: req.body.word_countdown,
			ng_request: req.body.ng_request
		});
		game.save( function (err){				
			if (err) return handleError (err);			
		});
		return res.send(game);
	    //res.json(req.body);
	  //}
	 	
};

exports.updateGame = function (req, res){
	console.log( 'Updating game ' + req.body.game );
    return Game.findById( req.params.id, function( err, game ) {
		game.complete = req.body.complete;
		game.active = req.body.active;
		game.round_turn = req.body.round_turn;
		game.word_turn = req.body.word_turn;
		game.place = req.body.place;
		game.round = req.body.round;
		game.players = req.body.players;
		game.word_countdown = req.body.word_countdown;
		game.ng_request = req.body.ng_request;

	    return game.save( function( err ) {
	        if( !err ) {
	            console.log( 'game updated' );
	        } else {
	            console.log( err );
	        }

	        
	    	return res.send( game );
	    });
    });
};

exports.postContact = function (req, res){
	    var contact = new Contact({
			player_id: req.body.player_id,
			name: req.body.name,
			comment: req.body.comment
		});
		contact.save( function (err){				
			if (err) return handleError (err);			
		});
		return res.send(contact);	 	
};

// Find all cards
exports.getCards = function (req, res){
	Card.find(function(err, cards){
    res.send(cards);
  });
};

//Find the card once selected
exports.getCard = function (req, res){
	return Card.findById( req.params.id, function( err, cards) {
        if( !err ) {
            return res.send( cards );
        } else {
            return console.log( err );
        }
    });
   
};
