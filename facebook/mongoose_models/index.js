//Keep reference to the schemas/models your using

//models
Player = require('./player');
Game = require('./game');


//exports
exports.Player = Player.playerModel;
exports.Game = Game.gameModel;