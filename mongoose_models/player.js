//setup mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var playerSchema = new Schema ({
	name: String,
	fb_id: {type: Number,index: true},
	first_name: String,
	last_name: String,
	city: String,
	gender: String,
	url: String,
	total_games: Number,
    last_login: String,

	games: [mongoose.Schema({
	  id: Number,
	  sentence: String,
	  completed: String,
	  turn: String,
	  player1: String,
	  player2: String
	}, { _id: false })]
});

module.exports = db.model('Player', playerSchema);