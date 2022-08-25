const User = require('../Models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

// user Handlers

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

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOneById(User, { path: 'comments' });

exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not defined! Please use /signup instead',
	});
};

// do NOT update passwords with this!
exports.updateUser = factory.updateOneById(User);
exports.deleteUser = factory.deleteOneById(User);
