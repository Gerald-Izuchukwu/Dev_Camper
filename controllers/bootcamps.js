const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const GeoCoder = require('../utils/geo-coder');
const Bootcamp = require('../models/Bootcamp');

//desc      Create all bootcamps
//route     POST /api/v1/bootcamps
//access    Private
exports.createBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        msg: 'success',
        data: bootcamp,
    });
});

//desc      Get all bootcamps
//route     GET /api/v1/bootcamps
//access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query }; // creating a copy of request.query
    const removeFields = ['select', 'sort', 'page', 'limit']; // fields to exclude
    removeFields.forEach((field) => delete reqQuery[field]); // loop over removeFields and delete them from reqQuery
    // console.log(reqQuery);
    let queryStr = JSON.stringify(reqQuery); // changing request query to a string, because in order to manipulate it to get the lte, gte etc, we need it in a string format

    // creating operators such as gte, lte, gt and lt
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    // mongoose method to find the bootcamps based on the query passed
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    // // select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // sort fields
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // pagination;
    const page = parseInt(req.query.page, 10) || 1; //this makes the default page to be page 1 or 2 or 3 depending while the 10 is the base of the number
    const limit = parseInt(req.query.limit, 10) || 4; // this makes the each page display only one bootcamp per page while the 10 is the base of the number
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const bootcamps = await query;

    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }
    console.log(req.query);
    res.status(200).json({
        msg: 'success',
        count: bootcamps.length,
        pagination,
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

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // get lat/long from geo coder
    const loc = await GeoCoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lon = loc[0].longitude;

    // calculate radius using radians
    // Divide distance  by radius of the earth ie 3963 mi or 6378km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centersSphere: [[lon, lat], radius] } },
    });

    res.status(200).json({
        msg: 'success',
        count: bootcamps.length,
        data: bootcamps,
    });
});

//desc      Update a bootcamp
//route     PUT /api/v1/bootcamps/:Id
//access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bootcamp) {
        return next(new ErrorResponse('Bootcamp NOT FOUND', 404));
    }
    res.status(203).json({
        msg: 'Success!!',
        data: bootcamp,
    });
});

//desc      Delete a bootcamp
//route     DELETE /api/v1/bootcamps/:Id
//access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse('Bootcamp NOT FOUND', 404));
    }

    await bootcamp.remove();

    const bootcamps = await Bootcamp.find();

    res.status(200).json({
        status: 'Successful',
        msg: `Bootcamp with  ID of ${req.params.id} has been deleted`,
        count: bootcamps.length,
        data: bootcamps,
    });
});

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp with that id exists`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please Upload a file `, 400));
    }
});
