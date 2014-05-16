var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var gameSchema = new Schema({
	game_id: Number,
	complete: Boolean,
	active: Boolean,
	turn: String,
	turn_fb_id: Number,
	online: Boolean,
	live: Boolean,
	controller: String,
	last_round_completed: Number,
	one_one_card: Number,
	one_two_card: Number,
	one_three_card: Number,
	two_one_card: Number,
	two_two_card: Number,
	three_card: Number,
	one_one_story: String,
	one_two_story: String,
	one_three_story: String,
	two_one_story: String,
	two_two_story: String,
	three_story: String,
	players: [{
		name: String,
		fb_id: Number,
		game_points: Number
	}]

});

module.exports = db.model('Game', gameSchema);