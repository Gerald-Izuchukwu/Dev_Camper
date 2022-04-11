const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        enum: ['User', 'Publisher'],
        default: 'User',
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
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// sign jwt
UserSchema.methods.getSignedJwtToken;

module.exports = mongoose.model('User', UserSchema);
