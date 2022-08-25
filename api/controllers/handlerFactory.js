const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

//needs req to grab something off of the parameters on the request.
createQueryObject = (req, queryParam) => {
	let query = {};
	for (const [key, value] of Object.entries(queryParam)) {
		// Because the end result is that value will still be a string, it allows us to use eval incase we have to run something like .toLowerCase() for a slug,
		// Might break, have tested different Injections and nothing got thru sicne this is passed directly into the query, but someone normally using it should have no issues
		query[key] = eval(value);
	}
	return query;
};

exports.deleteOneByQuery = (Model, queryParam = {}) =>
	catchAsync(async (req, res, next) => {
		const query = createQueryObject(req, queryParam);

		const document = await Model.findOneAndDelete(query);

		if (!document) {
			return next(
				new AppError('No document found with that query. ', 404),
			);
		}

		res.status(204).json({
			status: 'success',
			data: null,
		});
	});

exports.deleteOneById = (Model) =>
	catchAsync(async (req, res, next) => {
		const document = await Model.findByIdAndDelete(req.params.id);

		if (!document) {
			return next(new AppError('No document found with that Id ', 404));
		}

		res.status(204).json({
			status: 'success',
			data: null,
		});
	});

exports.updateOneByQuery = (Model, queryParam = {}) =>
	catchAsync(async (req, res, next) => {
		const query = createQueryObject(req, queryParam);
		const document = await Model.findOneAndUpdate(query, req.body, {
			new: true,
			runValidators: true,
		});

		if (!document) {
			return next(new AppError('No document found with that Query', 404));
		}
		res.status(200).json({
			status: 'success',
			data: {
				document,
			},
		});
	});

exports.updateOneById = (Model) =>
	catchAsync(async (req, res, next) => {
		const document = await Model.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			},
		);

		if (!document) {
			return next(new AppError('No document found with that ID', 404));
		}
		res.status(200).json({
			status: 'success',
			data: {
				document,
			},
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const document = await Model.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				data: document,
			},
		});
	});

exports.getOneById = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);

		if (popOptions) query = query.populate(popOptions);

		const document = await query;

		if (!document) {
			return next(new AppError('No document found with that ID', 404));
		}

		res.status(200).json({
			status: 'success',
			data: {
				data: document,
			},
		});
	});

exports.getOneByQuery = (Model, queryParam = {}, selectString = '') =>
	catchAsync(async (req, res, next) => {
		const query = createQueryObject(req, queryParam);
		let document;
		if (selectString.length > 0)
			document = await Model.findOne(query).select(selectString);
		else document = await Model.findOne(query);

		if (!document) {
			return next(new AppError('No Document was found with that Query'));
		}

		res.status(200).json({
			status: 'success',
			data: {
				data: document,
			},
		});
	});

exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		// Filter is a hack for now, it is only used on user Commenting right now
		let filter = {};

		if (req.params.userStreaming)
			filter = { userCommenting: req.params.userCommenting };

		// Execute Query
		const features = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();

		const document = await features.query;
		res.status(200).json({
			status: 'success',
			results: document.length,
			data: {
				data: document,
			},
		});
	});
