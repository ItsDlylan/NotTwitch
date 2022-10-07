const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();
const commentRouter = require('./../routes/commentRoutes');

// ROUTE MERGING
router.use('/:userStreaming/comments', commentRouter);

// USER ROUTES
router.post('/signup', authController.signup);
router.post('/login', authController.login);
// Protect all routes under this
router.use(authController.protect);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// req.body needs to have passwordCurrent, password, and passwordConfirm
router.patch('/updateMyPassword', authController.updatePassword);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete(
	'/softDeleteMe',
	authController.restrictTo('user'),
	userController.softDeleteMe,
);

router.patch(
	'/hardDeleteMe',
	authController.restrictTo('user'),
	userController.hardDeleteMe,
);

router.get('/me', userController.getMe, userController.getUser);
router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUser);

router
	.route('/:id')
	.get(userController.getUser)
	.patch(authController.restrictTo('admin'), userController.updateUser)
	.delete(authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;
