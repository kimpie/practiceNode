var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema ({
	name: String,
	id: {type: Number,index: true},
	first_name: String,
	last_name: String,
	location: String,
	gender: String,
	status: String,
	games_played: Number
});
module.exports = mongoose.model('Players', userSchema);