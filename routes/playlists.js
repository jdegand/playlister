const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Comment = require('../models/Comment');

function video_url_creator(ids){
  let videos = [];
  ids.forEach(id => {
    let video = 'https://youtube.com/embed/' + id;
    videos.push(video)
  })
  return videos;
}

/* /playlists */
router.get('/', function(req, res, next) {
  Playlist.find({}).lean().exec(function(err, playlists) {

    res.render('playlists_index', { playlists: playlists });
  });
});

router.get('/new', function(req, res, next) {
  res.render('playlists_new');
});

router.get('/:id', async function(req, res, next) {
  let comments = await Comment.find({"playlist_id":req.params.id}).lean();
  
  Playlist.findById(req.params.id).lean().exec(function(err, playlist) {
    res.render('playlists_show', { playlist: playlist, comments: comments });
  });
});

router.get('/:id/edit', function(req, res, next) {
  Playlist.findById(req.params.id).lean().exec(function(err, playlist) {

    res.render('playlists_edit', { playlist: playlist });
  });
});

router.post('/new', function(req, res, next) {

  let videos = req.body.vid_ids.split(/\r?\n/);
  videos = video_url_creator(videos);
  
  let playlist = new Playlist({
    title: req.body.title,
    description: req.body.description,
    vid_ids: req.body.vid_ids,
    videos: videos
  })
  
  Playlist.create(playlist).then((err, playlist)=> {
    if(err) console.error(err)

    res.redirect(`/playlists`);
  })
  
});
/*
router.post('/:id/edit', function(req, res, next) {

  let videos = req.body.vid_ids.split(/\r?\n/);
  videos = video_url_creator(videos);
  
  let playlist = new Playlist({
    title: req.body.title,
    description: req.body.description,
    vid_ids: req.body.vid_ids,
    videos: videos
  })
  
  Playlist.findByIdAndUpdate(req.params.id).then((err, playlist)=> {
    if(err) console.error(err)

    res.redirect(`/playlists`);
  })
  
});
*/

router.post('/:id/edit', (req, res) => {
  let videos = req.body.vid_ids.split(/\r?\n/);
  videos = video_url_creator(videos);

  Playlist.findById(req.params.id).then(playlist => {
    playlist.title = req.body.title;
    playlist.description = req.body.description;
    playlist.vid_ids = req.body.vid_ids;
    playlist.videos = videos;
    playlist.save();
    res.redirect(`/playlists/${req.params.id}`);
  }).catch((err) => {
    console.log(err);
  });
});


router.post('/:id/delete', (req, res) => {
  Playlist.findByIdAndDelete(req.params.id).then((err,item) => {
      if(err) console.error(err);
      res.redirect(`/playlists`);
  })
});

router.post('/comments', (req, res) => {
  let comment = new Comment({
    title: req.body.title,
    content: req.body.content,
    playlist_id: req.body.playlist_id
  })
  
  Comment.create(comment).then((err, comment)=> {
    if(err) console.error(err)

    res.redirect(`/playlists`);
  })
})

router.post('/comments/:id', (req,res) => {
  Comment.findByIdAndDelete(req.params.id).then((err,comment) => {
    if(err) console.error(err);
    res.redirect(`/playlists`);
  })
})

module.exports = router;
