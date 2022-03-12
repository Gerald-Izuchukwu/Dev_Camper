const express = require('express');
const {
    addCourse,
    getCourses,
    getCourseByID,
    updateCourse,
    deleteCourse,
} = require('../controllers/courses');
const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(addCourse);

router.route('/:id').get(getCourseByID).put(updateCourse).delete(deleteCourse);

module.exports = router;
