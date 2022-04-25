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

const { protect, authorizeARole } = require('../middleware/auth');

// rerouting into other resource routers
router.use('/:bootcampID/courses', courseRouter);

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorizeARole('Publisher', 'admin'), createBootcamps);
router
    .route('/:id')
    .get(getBootcampByID)
    .put(protect, authorizeARole('Publisher', 'admin'), updateBootcamp)
    .delete(protect, authorizeARole('Publisher', 'admin'), deleteBootcamp);

router.route('radius/:zipcode/:distance').get(getBootcampInRadius);

router
    .route('/:id/photo')
    .put(protect, authorizeARole('Publisher', 'admin'), bootcampPhotoUpload);
module.exports = router;
