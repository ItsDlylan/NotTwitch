const express = require('express');

const streamController = require('../controllers/streamController');

// Stream Routes
const router = express.Router();

// // Routes
// // All Streams
router
	.route('/streams')
	.get(streamController.getAllStreams)
	.post(streamController.createStream);

// Streams by userName
// router
// 	.route('/streams/:username')
// 	.get(streamController.getStream)
// 	.patch(streamController.updateStream)
// 	.delete(streamController.deleteStream);

module.exports = router;
