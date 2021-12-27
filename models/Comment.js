const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  "title": {type: String, required: true},
  "content": {type: String, required: true},
  "playlist_id": {type:String, required: true},
}, {timestamps: true});

module.exports = mongoose.model('Comment', CommentSchema);