const Comment = require('../Models/Comment');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
// Comment Handlers
// General Comment Controller Methods
//TODO: am going to need a seperate Router to get a comment from a user and the stream they were commenting on

// Middlewares
exports.setUserCommentingAndStreamingIds = (req, res, next) => {
	// Allow Nested Routes
	if (!req.body.userStreaming)
		req.body.userStreaming = req.params.userStreaming;
	// we get the req.user from the protect Middleware
	if (!req.body.user || req.body.user) req.body.userCommenting = req.user.id;

	next();
};

//getAll has a hack for the comments, TODO: find a fix to extract that fiter that only comments is using
exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOneById(Comment);
exports.createComment = factory.createOne(Comment);
exports.deleteComment = factory.deleteOneById(Comment);
exports.updateComment = factory.updateOneById(Comment);
