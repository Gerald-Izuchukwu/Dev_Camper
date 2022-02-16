const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//desc      Get all bootcamps
//route     GET /api/v1/bootcamps
//access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
        msg: 'success',
        count: bootcamps.length,
        data: bootcamps,
    });
});

//desc      GET a single  bootcamps
//route     GET /api/v1/bootcamps/:Id
//access    Private
exports.getBootcampByID = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse('Bootcamp NOT FOUND', 404));
    }

    res.status(200).json({
        msg: 'Success',
        data: bootcamp,
    });
});

//desc      Create all bootcamps
//route     POST /api/v1/bootcamps
//access    Private
exports.createBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        msg: 'success',
        data: bootcamp,
    });

    // res.send('date');
});

//desc      Update a bootcamp
//route     PUT /api/v1/bootcamps/:Id
//access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bootcamp) {
        return next(new ErrorResponse('Bootcamp NOT FOUND', 404));
    }
    res.status(200).json({
        msg: 'Success!!',
        data: bootcamp,
    });
});

//desc      Delete a bootcamp
//route     DELETE /api/v1/bootcamps/:Id
//access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findOneAndDelete(req.params.id);
    const bootcamps = await Bootcamp.find();

    if (!bootcamp) {
        return next(new ErrorResponse('Bootcamp NOT FOUND', 404));
    }

    res.status(200).json({
        status: 'Successful',
        count: bootcamps.length,
        data: bootcamps,
    });
});
