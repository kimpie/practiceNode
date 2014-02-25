//setup mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var playerSchema = new Schema ({
	name: String,
	fb_id: Number,
	first_name: String,
	last_name: String,
	city: String,
	gender: String,
	total_games: Number,
    last_login: String,
	games: [{ id: [{type: Schema.Types.ObjectId, ref: 'Game'}], player2_name: String }]
});

module.exports = db.model('Player', playerSchema);