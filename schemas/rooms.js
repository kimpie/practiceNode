var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = mongoose.Schema({
	room: { type: Number, index: true },
	status: String,
	numPlayers: Number,
	opponent: String,

	players: [mongoose.Schema({
	  id: String,
	  name: String,
	  first_name: String,
	  last_name: String,
	  location: String,
	  gender: String,
	  status: String
	}, { _id: false })]
 
});

module.exports = mongoose.model('Room', roomSchema);