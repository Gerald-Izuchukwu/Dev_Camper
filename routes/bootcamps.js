const express = require('express');
const {
    getBootcamps,
    createBootcamps,
    getBootcampByID,
    updateBootcamp,
    deleteBootcamp,
    getBootcampInRadius,
    bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResult');

// include other resources
const courseRouter = require('./courses');

const router = express.Router();

// rerouting into other resource routers
router.use('/:bootcampID/courses', courseRouter);

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(createBootcamps);
router
    .route('/:id')
    .get(getBootcampByID)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route('radius/:zipcode/:distance').get(getBootcampInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);
module.exports = router;
