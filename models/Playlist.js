const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
  "title": {type: String, required: true},
  "description": {type: String, required: true},
  "vid_ids": {type: String, required: true},
  "videos": {type: Array},
}, {timestamps: true});

//PlaylistSchema.virtual('link').get(function() { return `https://youtube.com/embed/${this.vid_ids}`; })

module.exports = mongoose.model('Playlist', PlaylistSchema);