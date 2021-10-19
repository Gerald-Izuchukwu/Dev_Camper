const express = require('express');
// const config = require('config');
const dotenv = require('dotenv');

// load environmental variables
dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on PORT: ${5000}`
    )
);
