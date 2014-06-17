var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var gameSchema = new Schema({
	game_id: String,
	complete: Boolean,
	active: Boolean,
	round_turn: String,
	word_turn: String,
	place: String,
	round: [{
		number: Number,
		story: String,
		card: String,
		in_progress: Boolean,
		complete: Boolean,
		review: Boolean,
		url: String,
		word_turn: String,
		level_one: Boolean,
		level_two: Boolean,
		level_three: Boolean,
		word_countdown: Number
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