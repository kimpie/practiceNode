var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var exampleSchema = new Schema ({
	message: {type: String, index: true},
	name: String,
	url: String
}, {strict: false});

module.exports = db.model('Example', exampleSchema);