const mongoose = require('mongoose');
const slugify = require('slugify');

const streamSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, 'A Stream must have a user applied to it'],
			trim: true,
			unique: true,
		},
		slug: String,
		title: {
			type: String,
			required: [true, 'A stream must have a title'],
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
		userID: {
			type: String,
			unique: [true, 'A user can only have 1 stream'],
			required: [true, 'A stream must be connected to a user'],
		},
		streamKEY: {
			type: String,
			required: [
				true,
				'A stream needs to have a streamKey in order to be broadcasted',
			],
			unique: [true, 'A stream can only be associated to 1 streamkey'],
			select: false,
		},
		createdAt: { type: Date, default: Date.now(), select: true },
		tags: {
			type: [String],
			enum: {
				values: [
					'english',
					'spanish',
					'french',
					'gaming',
					'irl',
					'coding',
				],
				message:
					'Acceptable tags are: english, spanish, french, gaming, irl or coding',
			},
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

streamSchema.set('toJSON', {
	virtuals: true,
	transform: (doc, ret, options) => {
		delete ret.__v;
		ret.id = ret._id.toString();
		delete ret._id;
	},
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
streamSchema.pre('save', function (next) {
	this.slug = slugify(this.username, { lower: true });
	next();
});

// QUERY MIDDLEWARE:
streamSchema.pre(/^find/, function (next) {
	this.start = Date.now();
	next();
});

streamSchema.post(/^find/, function (docs, next) {
	console.log(`Query took ${Date.now() - this.start} milliseconds!!`);
	next();
});

const Stream = mongoose.model('Stream', streamSchema);

module.exports = Stream;
