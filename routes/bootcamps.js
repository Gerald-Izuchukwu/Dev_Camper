const express = require('express');
const {
    getBootcamps,
    createBootcamps,
    getBootcampByID,
    updateBootcamp,
    deleteBootcamp,
} = require('../controllers/bootcamps');

const router = express.Router();

router.route('/').get(getBootcamps).post(createBootcamps);
router
    .route('/:id')
    .get(getBootcampByID)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;
