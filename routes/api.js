const express = require('express')
const router = express.Router()
const ejs = require('ejs');
const fs = require('fs');

const fetchParties = require('../utils/parties');
const fetchTheses = require('../utils/theses');
const { convertAnswerString, convertWeights, computeResult } = require('../utils/omat');

const database = require('../utils/database');
const { validate } = require('deep-email-validator');

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

router.get('/usercount', (req, res) => {
    // open file
    const data = fs.readFileSync('data/usercounter.json');
    const json = JSON.parse(data);

    // send response
    res.json({ count: json.userCounter });
});

router.post('/usercount', (req, res) => {
    if (!req.session.finished) {
        res.status(400).json({ error: 'User did not spend enough time on the quiz' });
        return;
    }

    // open file
    const data = fs.readFileSync('data/usercounter.json');
    const json = JSON.parse(data);

    // increment counter
    json.userCounter++;

    // save
    fs.writeFile('data/usercounter.json', JSON.stringify(json), (err) => {
        if (err) {
            console.log(err);
        }
    });

    // send response
    res.json({ count: json.userCounter });
});

router.post('/verlosung', async (req, res) => {
    if (!req.session.finished) {
        res.status(400).json({ error: 'User did not spend enough time on the quiz' });
        return;
    }

    const email = req.body.email;

    const response = database.insertEmail(req.session.id, email);
    if(!response.success) {
        res.status(400).json({ error: response.error });
        return;
    }
   
    res.json({ success: true });
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
