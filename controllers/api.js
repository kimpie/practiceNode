//export methods:
// post:  create a new player
// game: create a new game
// play: Show the new game
// list: return the list of games
  // Create your schemas and models here.

var Player = require('../mongoose_models/player.js');
var Game = require('../mongoose_models/game.js');
var Example = require('../mongoose_models/example.js');

//example purposes - can delete postmessage and exampleg when finished
exports.postMessage = function (req, res) {
  Example.create({
  	name: req.body.name, 
  	msg: req.body.msg, 
  	url: req.body.url 
  }, 
  	function (err, example) {
  		if (err) {
  			console.log(err);
  			res.status(500).json({status: 'failure'});
		} else {
			res.json({status: 'success'});
		}   	
    });
};

exports.exampleg = function (req, res){
	Example.find(function(err, examples){
    res.send(examples);
  });

};
//Player logic - find all players
exports.getPlayers = function (req, res){
	Player.find(function(err, players){
    res.send(players);
  });

};


// Player logic - create a new player on login

exports.postPlayer = function (req, res){
	/*var matches = players.filter(function  (player) {
    return player.url === req.body.url;
	  });

	  if (matches.length > 0) {
	    res.json(409, {status: 'item already exists'});
	  } else {
	   // req.body.id = req.body.url;
	    //players.push(req.body);
	    */
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
			if (err){
				console.log(err);
				//res.status(500).json({status: 'failure'});
			} else {
				console.log('created');
			}
		});
		return res.send(player);
	    //res.json(req.body);
	  //}
	 	
};

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
	    //player.games.game_id = req.body.game_id;
	    //player.games.player1 = req.body.player1;
	    //player.games.player2 = req.body.player2;
        
	    return player.save( function( err ) {
	        if( !err ) {
	            console.log( 'player updated' );
	        } else {
	            console.log( err );
	        }
	    	return res.send( player );
	    });
    });
};

//Player logic - find the player once they login
exports.getPlayer = function (req, res){
	return Player.findById( req.params.id, function( err, player) {
        if( !err ) {
            return res.send( player );
        } else {
            return console.log( err );
        }
    });
   
};


// Game logic - create a new game upon button invite
/*exports.game = function (req, res){
	//var randomNumber = function getRandomInt(min, max) {   
	//		return Math.floor(Math.random() * (max - min + 1) + min);
	Game.create({
	  	game:  
	  	msg: req.body.msg, 
	  	url: req.body.url 
	}, 
  	function (err, example) {
  		if (err) {
  			console.log(err);
  			res.status(500).json({status: 'failure'});
		} else {
			res.json({status: 'success'});
		}   	
    });new Game({game: game1, Player1: currentUser, Player2: response.to}).save();
};

exports.list = function (req, res){
	Game.find(function (err, games){
		res.send(games);
	});
};
*/

/*
exports.play = function (req, res){
	Game.findOne({game: req.params.game})
}
	var matches = inGame.filter(function  (game) {
	    return game.url === req.body.url;
	});

	if (matches.length > 0) {
	  res.json(409, {status: 'item already exists'});
	} else {
	  new Player({fb_id: currentUser}).save();
	  req.body.id = req.body.url;
	  inGame.push(req.body);
	  res.json(req.body);
	}
}*/