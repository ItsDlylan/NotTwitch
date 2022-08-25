const commentController = require('./../controllers/commentController');
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(commentController.getAllComments)
	.post(
		authController.protect,
		authController.restrictTo('user', 'admin'),
		commentController.setUserCommentingAndStreamingIds,
		commentController.createComment,
	);

router
	.route('/:id')
	.get(commentController.getComment)
	.patch(commentController.updateComment)
	.delete(commentController.deleteComment);
module.exports = router;
