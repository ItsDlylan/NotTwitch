/*
Everything in this file represents the Server, 
Connecting the Database, 
Error handling outside of Express, 
and Starting the server goes here.
*/
const mongoose = require('mongoose');

const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! Shutting down! ');
	console.log(err.name, err.message);
	process.exit(1);
});

const app = require('./app');
dotenv.config({
	path: './config.env',
});

console.log(process.env.DATABASE);
const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log(`DB connection successful`));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}...`);
});

const NodeMediaServer = require('node-media-server');

const config = {
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

process.on('unhandledRejection', (err) => {
	console.log('UNCAUGHT REJECTION! Shutting down! ');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
