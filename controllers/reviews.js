const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');
// const advancedResults = require('../middleware/advancedResult');

// @desc      Get reviews
// @route     GET /api/v1/review
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampID) {
		const reviews = await Review.find({
			bootcamp: req.params.bootcampID,
		});

		return res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

// @desc      Get a single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});
	if (!review) {
		return next(
			new ErrorResponse(
				`No review found with the id of ${req.params.id}`,
				404
			)
		);
	}
	res.status(200).json({
		success: true,
		data: review,
	});
});

// @desc      Add review
// @route     POST /api/v1/bootcamp/:bootcampId/reviews
// @access    Private
exports.addReview = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampID;
	req.body.user = req.user.id;
	const bootcamp = await Bootcamp.findById(req.params.bootcampID);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`No Bootcamp with the id of  ${req.params.bootcampID}`
			),
			404
		);
	}

	const review = await Review.create(req.body);

	res.status(201).json({
		success: true,
		data: review,
	});
});

// @desc      Update review
// @route     PUT /api/v1/reviews/:id
// @access    Private
exports.updateReview = asyncHandler(async (req, res, next) => {
	let review = await Review.findById(req.params.id);

	if (!review) {
		return next(
			new ErrorResponse(`No Bootcamp with the id of  ${req.params.id}`),
			404
		);
	}

	// making sure review belongs to a user or user is an admin
	if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new ErrorResponse('Not authorize to update review', 401));
	}

	review = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: review,
	});
});

// @desc      Delete review
// @route     DELETE /api/v1/reviews/:id
// @access    Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id);

	if (!review) {
		return next(
			new ErrorResponse(`No Bootcamp with the id of  ${req.params.id}`),
			404
		);
	}

	// making sure review belongs to a user or user is an admin
	if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(new ErrorResponse('Not authorize to update review', 401));
	}
	await review.remove(); //note that using Review.remove would delete all the bootcamp
	res.status(200).json({
		success: true,
		data: {},
	});
});
