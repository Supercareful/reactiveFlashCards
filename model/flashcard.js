'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FlashcardSchema = new Schema({
	userKey: String,
	question: String,
	answer: String
});

module.exports = mongoose.model("Flashcard", FlashcardSchema);