const mongoose = require('mongoose');
const slugify = require('slugify');
const geoCoder = require('../utils/geo-coder');

const BootcampSchema = new mongoose.Schema(
    {
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

        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// creating Bootcamp slug from the name

BootcampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    console.log('slugify ran', this.name);
    next();
});

// GEOcode and create location field

BootcampSchema.pre('save', async function (next) {
    const loc = await geoCoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipCode: loc[0].zipCode,
        country: loc[0].countryCode,
    };
    // do not save address in DB
    this.address = undefined;
    next();
});

// deleting courses when bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
    console.log(`Courses being removed from bootcamp = ${this._id}`);
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next();
});

// Reverse Populate with Virtuals
BootcampSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false,
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);

// const bootcampModel = mongoose.model('Bootcamp', BootcampSchema);
// module.exports = bootcampModel;
