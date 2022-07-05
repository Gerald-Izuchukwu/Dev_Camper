const express = require('express');
const {
	getReviews,
	getReview,
	addReview,
	updateReview,
	deleteReview,
} = require('../controllers/reviews');
const router = express.Router({ mergeParams: true });
const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResult');
const { protect, authorizeARole } = require('../middleware/auth');

router
	.route('/')
	.get(
		advancedResults(Review, {
			path: 'bootcamp', //if you add.js to the bootcamp it would load just the iD
			select: 'name description', // if you comma separate, only the last will show
		}),
		getReviews
	)
	.post(protect, authorizeARole('user', 'admin'), addReview);

router
	.route('/:id')
	.get(getReview)
	.put(protect, authorizeARole('user', 'admin'), updateReview)
	.delete(protect, authorizeARole('user', 'admin'), deleteReview);

// router
// 	.route('/:id')
// 	.get(getCourseByID)
// 	.put(protect, authorizeARole('publisher', 'admin'), updateCourse)
// 	.delete(protect, authorizeARole('publisher', 'admin'), deleteCourse);

module.exports = router;
