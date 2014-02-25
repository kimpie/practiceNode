var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var gameSchema = new Schema({
	game_id: Number,
	p1url: String,
	sentence: String,
	complete: String,
	turn: String,
	active: String,
	player1: Number,
	player2: Number,
	player2_name: String
});

module.exports = db.model('Game', gameSchema);