const express = require('express');
// const config = require('config');
const dotenv = require('dotenv');
// routes
const bootcamps = require('./routes/bootcamps');

// load environmental variables
dotenv.config({ path: './config/config.env' });

// initialize express
const app = express();

// mount routes
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on PORT: ${5000}`
    )
);
