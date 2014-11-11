var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
	key: Number,
	author: String,
	text: String
});
module.exports = mongoose.model('Comment', CommentSchema);