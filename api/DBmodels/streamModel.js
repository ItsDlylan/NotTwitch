const mongoose = require('mongoose');
const slugify = require('slugify');
// const { default: streams } = require('../../client/src/apis/streams');

const streamSchema = new mongoose.Schema(
	{
		userName: {
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
		createdAt: { type: Date, default: Date.now(), select: false },
		tags: {
			type: String,
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

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
streamSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
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
