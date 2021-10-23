const express = require('express');
const bootcamps = require('./routes/bootcamps');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

// initialize express
const app = express();

// logger middleware
// const logger = require('./middleware/logger');
// app.use(logger);

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
