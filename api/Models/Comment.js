const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
	{
		message: {
			type: String,
			required: [true, 'How can a comment not have a comment?'],
			trim: true,
			maxLength: [
				100,
				'A comment for a stream must have less than 100 characters.',
			],
			minLength: [
				1,
				'A comment has to atleast have 1 character to be sent.',
			],
		},
		userCommenting: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
				required: [true, 'A comment must come from a user.'],
			},
		],
		userStreaming: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'User',
				required: [
					true,
					'A comment has to be tied to the user the comment was posted on.',
				],
			},
		],
		createdAt: { type: Date, default: Date.now() },
		deletedAt: { type: Date, select: true },
		public: {
			type: Boolean,
			required: [
				true,
				'A comment has to either be set as public or private',
			],
			default: true,
		},
		// Private comments think Direct Messaging, completely different from the public that just displays comments to the stream chat
		private: {
			type: Boolean,
			default: false,
		},
	},
	// field not stored in database, show in output
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// QUERY MIDDLEWARE:

commentSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'userCommenting',
		select: 'username photo',
	});

	this.start = Date.now();
	next();
});

// Create an index of the UserCommenting, the userStreaming, and the createdAt so we can have quicker checks
// for Whenever we want to add a "throttling" and "you sent the same message too quickly" feature
commentSchema.index({ userCommenting: 1, userStreaming: 1, createdAt: 1 });

commentSchema.post(/^find/, function (docs, next) {
	console.log(`Comment Query took ${Date.now() - this.start} milliseconds!!`);
	next();
});

commentSchema.set('toJSON', {
	virtuals: true,
	transform: (doc, ret, options) => {
		delete ret.__v;
		ret.id = ret._id.toString();
		delete ret._id;
	},
});
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
