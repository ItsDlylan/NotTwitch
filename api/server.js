/*
Everything in this file represents the Server, 
Connecting the Database, 
Error handling outside of Express, 
and Starting the server goes here.
*/
const mongoose = require('mongoose');
const User = require('./Models/User');
const Stream = require('./Models/Stream');

const dotenv = require('dotenv');

dotenv.config({
	path: '../config.env',
});
const app = require('./app');

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log(`DB connection successful`));

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

// NodeMedia Server for Video Transfers
const NodeMediaServer = require('node-media-server');

const config = {
	logType: 3,
	rtmp: {
		port: 1935,
		chunk_size: 60000,
		gop_cache: true,
		ping: 30,
		ping_timeout: 60,
	},
	http: {
		port: 8000,
		allow_origin: '*',
	},
};

var nms = new NodeMediaServer(config);
nms.run();
// Create Stream when Streamer starts Stream
nms.on('prePublish', async (id, StreamPath, args) => {
	let streamkey = StreamPath.split('/');
	streamkey = streamkey[2];
	const user = await User.find({ streamKEY: streamkey });
	// Attempt to find an active stream with streamKey
	const findStream = await Stream.findOne({ streamKEY: streamkey });
	if (!findStream) {
		let streamObj = {
			username: user[0].username,
			title: user[0].title,
			userID: user[0].id,
			streamKEY: streamkey,
			tags: ['coding', 'english'],
		};
		const newStream = await Stream.create(streamObj);
	}
});
// Delete Stream when Streamer ends Stream
nms.on('donePublish', async (id, StreamPath, args) => {
	let streamkey = StreamPath.split('/');
	streamkey = streamkey[2];
	await Stream.findOneAndDelete({ streamKEY: streamkey });
});

process.on('unhandledRejection', (err) => {
	console.log('UNCAUGHT REJECTION! Shutting down! ');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
