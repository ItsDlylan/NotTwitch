const Stream = require('../Models/Stream');

const factory = require('./handlerFactory');
// Stream Handlers

// General Stream Controller Methods

/*
// @endpoint `/streams/:username`
*/
exports.getStream = factory.getOneByQuery(
	Stream,
	{
		slug: 'req.params.username.toLowerCase()',
	},
	'+streamKEY',
);

exports.getAllStreams = factory.getAll(Stream);

exports.createStream = (req, res) => {
	res.status(500).json({
		status: 'error',
		message:
			'This route is not defined! If you want to create a Stream, start Streaming with your Stream Key!',
	});
};

exports.updateStream = factory.updateOneByQuery(Stream, {
	slug: 'req.params.username.toLowerCase()',
});

exports.deleteStream = factory.deleteOneByQuery(Stream, {
	slug: 'req.params.username.toLowerCase()',
});
