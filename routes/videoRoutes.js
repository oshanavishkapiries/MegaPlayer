const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');


router.get('/', videoController.indexPage);

router.get('/stream-video', videoController.streamVideo);

router.post('/encript-link', videoController.encriptLink);

router.get('/player', videoController.playerPage);

module.exports = router;
