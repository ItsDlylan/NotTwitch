const express = require('express');
const streamController = require('../controllers/streamController');
const authController = require('../controllers/authController');
// Stream Routes
const router = express.Router();

//  Routes
//  All Streams

router
	.route('/')
	.get(streamController.getAllStreams)
	.post(
		authController.protect,
		authController.restrictTo('admin'),
		streamController.createStream,
	);

// Streams by userName
router
	.route('/:username')
	.get(streamController.getStream)
	.patch(
		authController.protect,
		authController.restrictTo('user', 'admin'),
		streamController.updateStream,
	)
	.delete(
		authController.protect,
		authController.restrictTo('user', 'admin'),
		streamController.deleteStream,
	);

module.exports = router;
