const express = require('express');
const {
    getBootcamps,
    createBootcamps,
    getBootcampByID,
    updateBootcamp,
    deleteBootcamp,
    getBootcampInRadius,
} = require('../controllers/bootcamps');

const router = express.Router();

router.route('/').get(getBootcamps).post(createBootcamps);
router
    .route('/:id')
    .get(getBootcampByID)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route('radius/:zipcode/:distance').get(getBootcampInRadius);
module.exports = router;
