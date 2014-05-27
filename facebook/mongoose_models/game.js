var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var gameSchema = new Schema({
	game_id: String,
	complete: Boolean,
	active: Boolean,
	turn: String,
	place: String,
	round_result: [{
		story: String,
		card: Number
	}],
	players: [{
		uid: Number,
		name: String,
		fb_id: Number,
		game_points: Number,
		controller: Boolean
	}]

});

module.exports = db.model('Game', gameSchema);