const express = require('express');

const morgan = require('morgan');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const bootcamps = require('./routes/bootcamps');

// initialize express
const app = express();

connectDB();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// mount routes
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on PORT: ${5000}`
    )
);
