const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	const message = `Duplicate field value: ${err.keyValue.name}. Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid Input data. ${errors.join('. ')}`;
	return new AppError(message, 400);
};

const handleJWTError = () =>
	new AppError('Invalid Token. Please log in again.', 401);

const handleJWTExpiredError = () =>
	AppError('Your token has expired! Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
	if (req.originalUrl.startsWith('/api')) {
		return res.status(err.statusCode).json({
			status: err.status,
			error: err,
			stack: err.stack,
			message: err.message,
		});
	}

	// Display view, not expecting any json expecting a redirect.
	//res.res().render
};
const sendErrorProd = (err, req, res) => {
	//API
	if (req.originalUrl.startsWith('/api')) {
		// Operational, trusted error: send message to client
		if (err.isOperational) {
			return res.status(err.statusCode).json({
				status: err.status,
				message: err.message,
			});
		}
		// Non Operational, Programming or other unknown non-trusted error: send a generic message that something messed up to client
		// 1) Log Error
		console.error('ERROR ', err);
		// 2) Send Generic Message
		return res.status(500).json({
			status: 'error',
			message: 'Something went very wrong!',
		});
	}

	// Display view, not expecting any json expecting a redirect.
	//res.res().render
	if (err.isOperational) {
		// Send operational message to the error view
	} else {
		// 1) Log Error
		console.error('ERROR ', err);
		// 2) Send Generic Message with error view
	}
};
module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, req, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err };
		// For some reason .name didnt get passed down when spread.
		error.name = err.name;
		error.message = err.message;

		if (error.name === 'CastError') error = handleCastErrorDB(error);
		if (error.name === 'ValidationError')
			error = handleValidationErrorDB(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
		if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
		if (error.code === 11000) error = handleDuplicateFieldsDB();

		sendErrorProd(error, req, res);
	}
};
