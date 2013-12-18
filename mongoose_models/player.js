//setup mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var playerSchema = new Schema ({
	name: String,
	fb_id: {type: Number,index: true},
	first_name: String,
	last_name: String,
	location: String,
	gender: String,
	games_played: Number
});

module.exports = db.model('Player', playerSchema);