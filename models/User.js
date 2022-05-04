const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter a name'],
    },
    email: {
        type: String,
        required: [true, "please enter Bootcamp's email"],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please enter a valid email'],
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'publisher'],
        default: 'user',
    },

    password: {
        type: String,
        required: true,
        minlength: [
            6,
            'The password should not contain less than 6 characters',
        ],
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpired: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// sign jwt
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};
// match user entered password to hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// generate and hash password token
// since we are calling the this function on the user and not model ie User, we use .methods and not .static
UserSchema.methods.getResetPasswordToken = function () {
    // generate the token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hash password
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // set expiration
    this.resetPasswordExpired = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
