const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// loading environmental variables
dotenv.config({ path: './config/config.env' });

// load models
const Bootcamp = require('./models/Bootcamp.js');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

// connecting to database
mongoose.connect(process.env.MONGO_URI, {
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// read json files
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

const users = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const reviews = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// importing into database
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps); //use this
		// const bootcamps = await Bootcamp.create(); //dont use this because we dont want to return the created bootcamps
		await Course.create(courses);
		await User.create(users);
		await Review.create(reviews);
		console.log('Data imported.....'.green.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();
		console.log('Data Deleted...'.red.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
