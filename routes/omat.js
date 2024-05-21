const express = require('express')
const router = express.Router()

const fetchTheses = require('../utils/theses');
const { convertAnswerString, convertWeights, computeResult } = require('../utils/omat');

require('dotenv').config();
const TITLE = process.env.TITLE || 'Omat';

router.get('/', (req, res) => {
    const answers = convertAnswerString(req.query.edit);
    const thesisNumber = Number.parseInt(req.query.thesis) - 1;

    res.render('omat', { title: TITLE, answers: answers, current: thesisNumber })
})

router.get('/overview', (req, res) => {
    const answers = convertAnswerString(req.query.edit);

    res.render('omat-overview', { title: TITLE, answers: answers })
});

router.get('/result', (req, res) => {
    const answers = convertAnswerString(req.query.answers);
    const weights = convertWeights(req.query.weights);

    const results = computeResult(answers, weights);

    res.render('omat-result', { title: TITLE, results: results, theses: fetchTheses() });
});

module.exports = router
