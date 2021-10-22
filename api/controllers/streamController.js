const Stream = require('../DBmodels/streamModel');
// const APIFeatures = require('../utils/apiFeatures');
// // const catchAsync = require('../utils/catchAsnyc');
// // const AppError = require('../utils/appError');

// Stream Handlers
// General Stream Controller Methods

exports.getAllStreams = async (req, res, next) => {
	try {
		console.log(hit);
		res.status(200).json({
			status: 'success',
			results: 1,
			data: {
				streams: 1,
			},
		});
	} catch (err) {
		next(err);
	}
};
// exports.createStream = async (req, res, next) => {
// 	console.log(hit);
// 	res.status(200).json({
// 		status: 'success',
// 		results: 1,
// 		data: {
// 			streams: 1,
// 		},
// 	});
// };
// // // Stream Controller Methods by userName
// // ENDPOINT `/streams/:username`
// exports.getStream = async (req, res, next) => {
// 	console.log(hit);
// 	res.status(200).json({
// 		status: 'success',
// 		results: 1,
// 		data: {
// 			streams: 1,
// 		},
// 	});
// };

// exports.updateStream = async (req, res, next) => {
// 	console.log(hit);
// 	res.status(200).json({
// 		status: 'success',
// 		results: 1,
// 		data: {
// 			streams: 1,
// 		},
// 	});
// };

// exports.deleteStream = async (req, res, next) => {
// 	console.log(hit);
// 	res.status(200).json({
// 		status: 'success',
// 		results: 1,
// 		data: {
// 			streams: 1,
// 		},
// 	});
// };
