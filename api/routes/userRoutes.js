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

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// req.body needs to have passwordCurrent, password, and passwordConfirm
router.patch(
	'/updateMyPassword',
	authController.protect,
	authController.updatePassword,
);

router.patch('/updateMe', authController.protect, userController.updateMe);

router
	.route('/')
	.get(userController.getAllUsers)
	.post(userController.createUser);

router
	.route('/:id')
	.get(userController.getUser)
	.patch(authController.protect, userController.updateUser)
	.delete(authController.protect, userController.deleteUser);

module.exports = router;
