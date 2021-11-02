const Stream = require('../DBmodels/streamModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Stream Handlers
// General Stream Controller Methods

exports.getAllStreams = catchAsync(async (req, res, next) => {
	// Execute Query
	const features = new APIFeatures(Stream.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const streams = await features.query;

	res.status(200).json({
		status: 'success',
		results: streams.lengh,
		data: {
			streams,
		},
	});
});

exports.createStream = catchAsync(async (req, res, next) => {
	const newStream = await Stream.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			streams: newStream,
		},
	});
});

// // // Stream Controller Methods by userName
// // ENDPOINT `/streams/:username`
exports.getStream = catchAsync(async (req, res, next) => {
	const query = { slug: req.params.username.toLowerCase() };
	const stream = await Stream.findOne(query).select('+streamKEY');

	if (!stream) {
		return next(new AppError('No Stream found with that username', 404));
	}

	res.status(200).json({
		status: 'success',
		data: {
			stream,
		},
	});
});

exports.updateStream = catchAsync(async (req, res, next) => {
	const query = { slug: req.params.username.toLowerCase() };

	const stream = await Stream.findOneAndUpdate(query, req.body, {
		new: true,
		runValidators: true,
	});

	if (!stream) {
		return next(new AppError('No stream found with that username', 404));
	}
	res.status(200).json({
		status: 'success',
		data: {
			stream,
		},
	});
});

exports.deleteStream = async (req, res, next) => {
	const query = { slug: req.params.username.toLowerCase() };
	const stream = await Stream.findOneAndDelete(query);

	if (!stream) {
		return next(new AppError('No Stream found with that username', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
};
