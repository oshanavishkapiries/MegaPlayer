const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Route to serve index page
router.get('/', videoController.indexPage);

// Route to handle video streaming
router.get('/stream-video', videoController.streamVideo);

// Route to handle encript link
router.post('/encript-link', videoController.encriptLink);

// Route to serve player page
router.get('/player', videoController.playerPage);

module.exports = router;
