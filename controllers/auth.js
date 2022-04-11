const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

exports.registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // creating user
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    res.status(200).json({
        status: true,
        msg: 'User created',
    });
});
