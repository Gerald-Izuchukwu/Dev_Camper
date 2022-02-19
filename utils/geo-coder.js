const NodeGeoCoder = require('node-geocoder');

const options = {
    provider: process.env.GEO_PROVIDER,
    httpAdapter: 'https',
    apiKey: process.env.GEO_API_KEY,
    formatter: null,
};

const geoCoder = NodeGeoCoder(options);

module.exports = geoCoder;
