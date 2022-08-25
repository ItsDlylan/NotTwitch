const commentController = require('./../controllers/commentController');
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
	.route('/')
	.get(commentController.getAllComments)
	.post(
		authController.restrictTo('user', 'admin'),
		commentController.setUserCommentingAndStreamingIds,
		commentController.createComment,
	);

router
	.route('/:id')
	.get(commentController.getComment)
	.patch(authController.restrictTo('admin'), commentController.updateComment)
	.delete(
		authController.restrictTo('admin'),
		commentController.deleteComment,
	);
module.exports = router;
