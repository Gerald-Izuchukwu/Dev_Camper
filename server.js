const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const bootcamps = require('./routes/bootcamps');
// const Bootcamp = require('./models/Bootcamp');
const colors = require('colors');
const errorHandler = require('./middleware/error');

// connecting to database
connectDB();
// initialize express
const app = express();

app.use(express.json());

// morgan logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// mount routes
app.use('/api/v1/bootcamps', bootcamps);

// error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

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
