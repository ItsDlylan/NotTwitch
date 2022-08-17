/*
Everything in this file represents the APP, all the middleware the APP uses goes here.
*/

// 3rd Party Express Module
const express = require('express');

// Global Middleware
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');

// ERRORS
const AppError = require('./utils/appError');
const globalErrorhandler = require('./controllers/errorController');

// CUSTOM ROUTERS
const streamRouter = require('./routes/streamRoutes');
const userRouter = require('./routes/userRoutes');

// Create the app, run instance express()
const app = express();

// Node serve static files built from React.
app.use(express.static(path.resolve(__dirname, '../client/build')));

// GLOBAL MIDDLEWARES
// Set security HTTP Headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Access Logging
let accessLogStream = rfs.createStream('access.log', {
	interval: '1d', // rotate daily
	path: path.join(__dirname, 'log'),
});
app.use(morgan('common', { stream: accessLogStream }));
// Limit requests from same IP
const limiter = rateLimit({
	max: 300,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests, please try again in an hour!',
});

const loginLimiter = rateLimit({
	max: 10,
	windowMs: 60 * 60 * 1000,
	message: 'Too many login requests, please try again in an hour!',
});

app.use('/api', limiter);
app.use('/api/v1/users/login', loginLimiter);

app.use(cors());

//Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query Injection
app.use(mongoSanitize());

// Data Sanitization against XSS (Cross Site Scripting)
app.use(xss());

//Prevent parameter pollution
app.use(
	hpp({
		whitelist: [''],
	}),
);

// Test Middleware
app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});

// 3) Routes

app.use('/api/v1/streams', streamRouter);
app.use('/api/v1/users', userRouter);

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.all('*', (req, res, next) => {
	res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
	next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorhandler);

module.exports = app;
