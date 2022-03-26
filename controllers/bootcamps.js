const path = require('path');
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
    res.status(200).json(res.advancedResults);
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
    console.log(req.files);
    const file = req.files.file;

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload a image`, 400));
    }

    // check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} Bytes`,
                404
            )
        );
    }

    // create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
    console.log(file.name);
});
