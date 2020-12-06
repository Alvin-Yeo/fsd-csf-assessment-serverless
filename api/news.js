// load libraries
const express = require('express');
const morgan = require('morgan');
const fetch = require('node-fetch');
const withQuery = require('with-query').default;

const URL = 'https://newsapi.org/v2/top-headlines';

module.exports = (req, res) => {

    // create an instance of expree
    const app = express();

    // use morgan to log all requests
    app.use(morgan('combined'));

    // resources
    app.get('/api/news', async(req, res) => {
        const country = req.query['country'];
        const category = req.query['category'];
        const pageSize = req.query['pageSize'];
        const apiKey = req.header('X-Api-Key');

        let response;
        let results;

        const endpoint = withQuery(URL, {
            country,
            category,
            pageSize
        });

        try {
            response = await fetch(endpoint, { headers: { 'X-Api-Key': apiKey }});
            results = await response.json();
            // console.log('Fetched results: ', results);
        } catch(e) {
            console.error('Failed to fetch in Node: ', e);
        }

        res.status(200);
        res.type('application/json');
        res.json(results);
    });

    // pass req, res to express
    app(req, res);

}