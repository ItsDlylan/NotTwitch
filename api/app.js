/*
Everything in this file represents the APP, all the middleware the APP uses goes here.
*/
// 3rd Party Express Module
const express = require('express');
// Middleware Morgan
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const AppError = require('./utils/appError');
const globalErrorhandler = require('./controllers/errorController');
// Custom Routers
const streamRouter = require('./routes/streamRoutes');
const userRouter = require('./routes/userRoutes');

// Create the app, run instance express()
const app = express();

// Node serve static files built from React.
app.use(express.static(path.resolve(__dirname, '../client/build')));

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

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
