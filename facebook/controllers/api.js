var Player = require('../mongoose_models/player.js');
var Game = require('../mongoose_models/game.js');


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
		    last_login: req.body.last_login
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
        //player.games.player2_name = req.body.player2_name;

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
			p1url: req.body.p1url,
			sentence: req.body.sentence,
			completed: req.body.completed,
			turn: req.body.turn, 
			player1: req.body.player1,
			player1_name: req.body.player1_name,
			player2: req.body.player2,
			player2_name: req.body.player2_name
		});
		game.save( function (err){				
			if (err) return handleError (err);			
		});
		return res.send(game);
	    //res.json(req.body);
	  //}
	 	
};
