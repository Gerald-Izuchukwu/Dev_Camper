const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
        unique: false,
        max_length: [50, 'Characters should not exceed 50'],
    },

    slug: String,

    description: {
        type: String,
        max_length: [500, 'Description should not be more than 500 characters'],
        unique: false,
        required: true,
    },
    weeks: {
        type: String,
        required: [true, 'Please add the number of weeks'],
    },
    tuition: {
        type: Number,
        required: [true, 'please add a specified amount for the courses'],
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },

    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced', 'professional'],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
    // console.log(`Calculating Average Cost....`.blue);
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId },
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition ' },
            },
        },
    ]);
    console.log(obj);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
        });
    } catch (err) {
        console.log(err);
    }
};

// middleware to getAverageCost after save
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

// middleware to getAverageCost after delete
CourseSchema.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
