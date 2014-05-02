var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema ({
	comment: String,
	name: String,
	player_id: Number
}, {strict: false});

module.exports = db.model('Contact', contactSchema);