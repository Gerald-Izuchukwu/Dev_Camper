const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add a name '],
        unique: true,
        trim: true,
        max_length: [50, 'Name cannot be more than 50 characters'],
    },
    slug: String,

    description: {
        type: String,
        required: [true, 'please add a description to your bootcamp '],
        max_length: [500, 'Description should not exceed 500 characters'],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'please use a valid url with HTTP or HTTPS',
        ],
    },
    phoneNumber: {
        type: String,
        max_length: [15, 'Phone number should not exceed 15'],
    },
    email: {
        type: String,
        required: [true, "please enter Bootcamp's email"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please enter a valid email'],
    },
    address: {
        type: String,
        required: [true, 'Please add an address to your bootcamp'],
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
            // required: true,
        },
        coordinates: {
            type: [Number], //this is an array of numbers hence the brackets
            // required: true,
            index: '2dsphere',
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },

    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other',
        ],
    },

    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'The Maximum rating is 10'],
    },
    averageCost: Number,

    photo: {
        type: String,
        default: 'no-photo.jpeg',
    },

    housing: {
        type: Boolean,
        default: false,
    },
    jobAssistance: {
        type: Boolean,
        default: false,
    },
    jobGuarantee: {
        type: Boolean,
        default: false,
    },
    acceptGi: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);

// const bootcampModel = mongoose.model('Bootcamp', BootcampSchema);
// module.exports = bootcampModel;
