const path = require('path');
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const cookieParser = require('cookie-parser');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const fileUpload = require('express-fileupload');
const colors = require('colors');
const errorHandler = require('./middleware/error');

// connecting to database
connectDB();
// initialize express
const app = express();

// body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// morgan logger
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//file upload middleware
app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'public')));

// mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

// error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on PORT: ${PORT}`.yellow
			.bold
	)
);

// handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Unhandled Rejection, server closed ${err.message}`.red.bold);
	//close server and exit
	server.close(() => {
		process.exit(1);
	});
});
