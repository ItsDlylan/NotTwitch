const commentController = require('./../controllers/commentController');
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router
	.route('/')
	.get(commentController.getAllComments)
	.post(
		authController.protect,
		authController.restrictTo('user', 'admin'),
		commentController.createComment,
	);

module.exports = router;
