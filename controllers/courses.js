const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResult');

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampID;

    const bootcamp = await Bootcamp.findById(req.params.bootcampID);

    if (!bootcamp) {
        return next(
            new ErrorResponse(
                `No Bootcamp with the id of  ${req.params.bootcampID}`
            ),
            404
        );
    }
    const course = await Course.create(req.body);

    res.status(201).json({
        success: true,
        msg: 'Course Added',
        Data: course,
    });
});

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampID) {
        const courses = Course.find({
            bootcamp: req.params.bootcampID,
        });

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } else {
        res.status(200).json(advancedResults);
    }
});

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourseByID = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name, description',
    });

    if (!course) {
        return next(
            new ErrorResponse(`No course with the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: 'true',
        data: course,
    });
});

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(
            new ErrorResponse(`No Course with the id of ${req.params.id} exist`)
        );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(202).json({
        success: true,
        message: `The updated course with id of ${req.params.id} is:`,
        data: course,
    });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(
            new ErrorResponse(
                `No Course with the id of ${req.params.id} exists`,
                404
            )
        );
    }

    // course = await Course.findByIdAndDelete(req.params.id);
    await course.remove();
    const courses = await Course.find();

    res.status(200).json({
        success: true,
        message: 'Course has been deleted',
        count: courses.length,
        data: courses,
    });
});
