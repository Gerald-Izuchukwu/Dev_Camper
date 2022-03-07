const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const GeoCoder = require('../utils/geo-coder');
const Bootcamp = require('../models/Bootcamp');
const slugify = require('slugify');

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

    // creating a copy of request.query
    const reqQuery = { ...req.query };

    // fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    console.log(reqQuery);
    // changing request query to a string
    let queryStr = JSON.stringify(reqQuery);

    // creating operators such as gte, lte, gt and lt
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    // mongoose method to find the bootcamps based on the query passed
    query = Bootcamp.find(JSON.parse(queryStr));

    // select fields
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

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
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
    // console.log(req.query);
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
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
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

// route GET api/v1/bootcamps/radius/:zipcode/:distance
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
