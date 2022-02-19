const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;
    console.log(err);
    // console.log(err.name);
    if (err.name === 'Error') {
        const message = `Resource with id of ${err.value} is not found`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose Duplicate Key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // mongoose validation error

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server ERROR',
    });
};

module.exports = errorHandler;
