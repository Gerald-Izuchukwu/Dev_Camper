const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
	reviewTitle: {
		type: String,
		trim: true,
		required: [true, 'Please enter a title for your review'],
		maxlength: 50,
	},
	reviewBody: {
		type: String,
		required: [true, 'Please enter your review here'],
	},
	reviewRating: {
		type: Number,
		min: 1,
		max: 10,
		required: [true, 'please add a review rating between 1 to 10'],
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
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
});

// allows user to add only one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// static method to get the average bootcamp rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
	// console.log(`Calculating Average Cost....`.blue);
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId },
		},
		{
			$group: {
				_id: '$bootcamp',
				averageRating: { $avg: '$rating ' },
			},
		},
	]);
	console.log(obj);

	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageRating: obj[0].averageCost,
		});
	} catch (err) {
		console.log(err);
	}
};

// middleware to getAverageRating after save
ReviewSchema.post('save', function () {
	this.constructor.getAverageRating(this.bootcamp);
});

// middleware to getAverageRating after delete
ReviewSchema.pre('remove', function () {
	this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
