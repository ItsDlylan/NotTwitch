const User = require('../DBmodels/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

// user Handlers
exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find();

	res.status(200).json({
		status: 'success',
		results: users.length,
		data: {
			users,
		},
	});
});

exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!',
	});
};

exports.updateMe = catchAsync(async (req, res, next) => {
	// 1) Create error if user POSTs password data
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError(
				'This route is not for password updates. Please use /updateMyPassword.',
			),
			400,
		);
	}
	// 2) Filter Out Unwanted field names that are not allowed to be updated.
	// we have to filter the body so the user cant change fields we dont want them to like role for example
	const filteredBody = filterObj(
		req.body,
		'username',
		'email',
		'title',
		// 'photo',
	);
	// 3) Update User Document
	const updatedUser = await User.findByIdAndUpdate(
		req.user.id,
		filteredBody,
		{
			new: true,
			runValidators: true,
		},
	);

	res.status(200).json({
		status: 'success',
		data: {
			user: updatedUser,
		},
	});
});

exports.getUser = catchAsync(async (req, res) => {
	const user = await User.findOne({ username: req.params.username });
	console.log({ user });
	res.status(200).json({
		status: 'success',
		data: {
			user,
		},
	});
});

exports.updateUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!',
	});
};

exports.deleteUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!',
	});
};
