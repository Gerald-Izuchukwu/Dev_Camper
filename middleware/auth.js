const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    // making sure token exists
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    //else if (req.cookies.token){
    //     token = req.cookies.token
    // }

    // making sure user has token
    if (!token) {
        return next(
            new ErrorResponse(
                'You are not permitted to perform this action',
                401
            )
        );
    }

    // verifying the token
    try {
        // extract the payload object
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return next(
            new ErrorResponse(
                'You are not permitted to perform this action',
                401
            )
        );
    }
});

// grant access to specific roles
exports.authorizeARole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `Sorry your current role ${req.user.role} cannot perform this operation`,
                    403
                )
            );
        }
        next();
    };
}; //we use the spread operator cos what will be passed is a comma separated list of roles
