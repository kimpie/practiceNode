var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var gameSchema = new Schema({
	game_id: Number,
	p1url: String,
	p2url: String,
	sentence: String,
	complete: Boolean,
	turn: Number,
	active: Boolean,
	player1: Number,
	player1_name: String,
	player2: Number,
	player2_name: String
});

module.exports = db.model('Game', gameSchema);