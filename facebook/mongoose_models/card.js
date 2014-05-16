var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var cardSchema = new Schema ({
	level: Number,
	direction: String,
	rule: String
});

module.exports = db.model('Card', cardSchema);