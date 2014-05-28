var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var cardSchema = new Schema ({
	level: String,
	direction: String,
	rule: String,
	timer: Boolean
});

module.exports = db.model('Card', cardSchema);