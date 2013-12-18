//export methods:
// post:  create a new player
// game: create a new game
// play: Show the new game
// list: return the list of games
  // Create your schemas and models here.

var Player = require('../mongoose_models/player.js');
var Game = require('../mongoose_models/game.js');
var Example = require('../mongoose_models/example.js');

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

exports.postPlayer = function (req, res){
	var currentUser = info.id;
	Player.create({
		fb_id: currentUser, 
		name: name
	},
		function(err, player){
			if (err){
				console.log(err);
				res.status(500).json({status: 'failure'});
			} else {
				res.json({status: 'success'});
			}
		}
	);
};


exports.game = function (req, res){
	//var randomNumber = function getRandomInt(min, max) {   
	//		return Math.floor(Math.random() * (max - min + 1) + min);
	new Game({game: game1, Player1: currentUser, Player2: response.to}).save();
};

exports.list = function (req, res){
	Game.find(function (err, games){
		res.send(games);
	});
}


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