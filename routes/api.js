const express = require('express')
const router = express.Router()
const ejs = require('ejs');

const fetchParties = require('../utils/parties');
const fetchTheses = require('../utils/theses');
const { convertAnswerString, convertWeights, computeResult } = require('../utils/omat');

const nodeHtmlToImage = require('node-html-to-image');

require('dotenv').config();
const TITLE = process.env.TITLE || 'Omat';
const SUBTITLE = process.env.SUBTITLE || '';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

const parties = fetchParties();
const theses = fetchTheses();

router.get('/parties', (req, res) => {
    res.json(parties);
});

router.get('/theses', (req, res) => {
    res.json(theses);
});

/*
router.get('/sharepic', async (req, res) => {
    const answers = convertAnswerString(req.query.answers);
    const weights = convertWeights(req.query.weights);

    const results = computeResult(answers, weights);

    try {
        const html = await ejs.renderFile('./views/sharepic.ejs', { title: TITLE, subtitle: SUBTITLE, results: results, theses: theses, parties: parties, serverUrl: SERVER_URL });

        const image = await nodeHtmlToImage({
            html: html,
            puppeteerArgs: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
            encoding: 'binary',
            type: 'png',
            quality: 100
        });

        res.set('Content-Type', 'image/png');
        res.send(image);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}); */

module.exports = router;
