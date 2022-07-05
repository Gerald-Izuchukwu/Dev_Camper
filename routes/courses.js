const express = require('express');
const {
	addCourse,
	getCourses,
	getCourseByID,
	updateCourse,
	deleteCourse,
} = require('../controllers/courses');
const router = express.Router({ mergeParams: true });
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResult');
const { protect, authorizeARole } = require('../middleware/auth');

router
	.route('/')
	.get(
		advancedResults(Course, {
			path: 'bootcamp', //if you add.js to the bootcamp it would load just the iD
			select: 'name description', // if you comma separate, only the last will show
		}),
		getCourses
	)
	.post(protect, authorizeARole('publisher', 'admin'), addCourse);

router
	.route('/:id')
	.get(getCourseByID)
	.put(protect, authorizeARole('publisher', 'admin'), updateCourse)
	.delete(protect, authorizeARole('publisher', 'admin'), deleteCourse);

module.exports = router;
