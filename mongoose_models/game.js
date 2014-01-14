var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = mongoose.Schema({
	game: { type: Number, index: true },
	status: String,
	Player1: Number,
	Player2: Number

	/*players: [mongoose.Schema({
	  id: Number,
	  name: String,
	  first_name: String,
	  last_name: String,
	  location: String,
	  gender: String,
	  status: String
	}, { _id: false })]*/
 
});

module.exports = db.model('Game', gameSchema);