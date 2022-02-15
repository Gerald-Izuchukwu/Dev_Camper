const Bootcamp = require('../models/Bootcamp');

//desc      Get all bootcamps
//route     GET /api/v1/bootcamps
//access    Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({
            msg: 'success',
            count: bootcamps.length,
            data: bootcamps,
        });
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            msg: 'e no work',
        });
    }
};

//desc      GET a single  bootcamps
//route     GET /api/v1/bootcamps/:Id
//access    Private
exports.getBootcampByID = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({
                msg: 'bootcamp not found',
            });
        }

        res.status(200).json({
            msg: 'Success',
            data: bootcamp,
        });
    } catch (error) {
        next(error);
    }
};

//desc      Create all bootcamps
//route     POST /api/v1/bootcamps
//access    Private
exports.createBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            msg: 'success',
            data: bootcamp,
        });

        // res.send('date');
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: 'Cannot create Bootcamp',
        });
    }
};

//desc      Update a bootcamp
//route     PUT /api/v1/bootcamps/:Id
//access    Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!bootcamp) {
            return res.status(400).json({
                status: 'Failed!!',
                msg: 'Bootcamp with ID number is not found',
            });
        }
        res.status(200).json({
            msg: 'Success!!',
            data: bootcamp,
        });
    } catch (error) {}
};

//desc      Delete a bootcamp
//route     DELETE /api/v1/bootcamps/:Id
//access    Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findOneAndDelete(req.params.id);
        const bootcamps = await Bootcamp.find();

        if (!bootcamp) {
            return res
                .status(400)
                .json({ status: 'failed', msg: 'Bootcamp not found' });
        }

        res.status(200).json({
            status: 'Successful',
            count: bootcamps.length,
            data: bootcamps,
        });
    } catch (error) {}
};
