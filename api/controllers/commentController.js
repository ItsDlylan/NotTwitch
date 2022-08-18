const Comment = require('../Models/Comment');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Comment Handlers
// General Comment Controller Methods

exports.getAllComments = catchAsync(async (req, res, next) => {
	const comments = await Comment.find();

	res.status(200).json({
		status: 'success',
		results: comments.length,
		data: {
			comments,
		},
	});
});

exports.createComment = catchAsync(async (req, res, next) => {
	const newComment = await Comment.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			comment: newComment,
		},
	});
});
