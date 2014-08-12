var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var wordSchema = new Schema ({
	word: String,
});

module.exports = db.model('Word', wordSchema);