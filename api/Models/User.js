const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'A user must have a username'],
			trim: true,
			unique: true,
		},
		email: {
			type: String,
			required: [true, 'A user must have a valid Email'],
			trim: true,
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, 'Please provide a valid Email'],
		},
		slug: String,
		photo: String,

		password: {
			type: String,
			required: [true, 'A user must have a password'],
			trim: true,
			minlength: 8,
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, 'Passwords must match.'],
			trim: true,
			validate: {
				// This only works on CREATE and SAVE
				validator: function (el) {
					return el === this.password;
				},

				message: 'Passwords are not the same',
			},
		},
		passwordChangedAt: {
			type: String,
			select: false,
		},
		passwordResetToken: {
			type: String,
			select: false,
		},
		passwordResetExpires: {
			type: Date,
			select: false,
		},
		streamKEY: {
			type: String,
			unique: [true, 'A stream can only be associated to 1 streamkey'],
			select: false,
		},
		createdAt: { type: Date, default: Date.now() },
		title: {
			type: String,
			trim: true,
			maxlength: [
				30,
				'A stream title must have less or equal then 30 characters',
			],
			minlength: [
				10,
				'A stream title must have more or equal then 10 characters',
			],
		},
		followers: [String],
		following: [String],
		role: {
			type: String,
			enum: ['user', 'moderator', 'admin'],
			default: 'user',
		},
	},
	// field not stored in database, show in output
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// VIRTUAL

//Virtual populate, setting up the relationships for Parent Referencing populations on Comments
userSchema.virtual('comments', {
	ref: 'Comment',
	//foreign = name on other Model
	foreignField: 'userStreaming',
	//local = where the id is stored on the user
	localField: '_id',
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()

// Password Hashing
userSchema.pre('save', async function (next) {
	// Only run this function if password was actually modified
	if (!this.isModified('password')) return next();
	// Hash the password with the cost of 12
	this.password = await bcrypt.hash(this.password, 12);
	// Delete passwordConfirm field
	this.passwordConfirm = undefined;
	next();
});

userSchema.pre('save', function (next) {
	// if we didnt modify the password property or if the document is new go to the next middleware.
	if (!this.isModified('password') || this.isNew) return next();

	// we subtract 1 second, because sometimes the token is sent before the timestamp is set. leading to future bugs. so we go back a second just in case of that
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

// UPDATE MIDDLEWARE:

//Update the moderators being updated, same as the save where we attempt to find the Users by the id being saved.
userSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
	next();
});

// QUERY MIDDLEWARE:

// METHODS
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword,
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10,
		);

		return JWTTimestamp < changedTimestamp;
	}

	// FALSE means not changed.
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	// Creates a random string of 32 bytes, and changing it to hex
	const resetToken = crypto.randomBytes(32).toString('hex');

	//Encrypt the resetToken using the sha256 algorithm,
	//and changing it into hex and storing it on the document.
	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// Set the new expire date for 10 minutes after creation.
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	// Then return the plain resetToken to send in the email thats going to be compared to the resetToken on the document later.
	return resetToken;
};

userSchema.set('toJSON', {
	virtuals: true,
	transform: (doc, ret, options) => {
		delete ret.__v;
		ret.id = ret._id;
		delete ret._id;
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
