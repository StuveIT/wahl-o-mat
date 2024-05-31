const express = require('express')
const router = express.Router()
const fs = require('fs');

const fetchTheses = require('../utils/theses');
const { convertAnswerString, convertWeights, computeResult } = require('../utils/omat');

require('dotenv').config();
const TITLE = process.env.TITLE || 'Omat';

router.get('/', (req, res) => {
    const answers = convertAnswerString(req.query.edit);
    const thesisNumber = Number.parseInt(req.query.thesis) - 1;

    req.session.startedAt = new Date();

    res.render('omat', { title: TITLE, answers: answers, current: thesisNumber });
})

router.get('/overview', (req, res) => {
    const answers = convertAnswerString(req.query.edit);

    res.render('omat-overview', { title: TITLE, answers: answers })
});

router.get('/result', async (req, res) => {
    const answersString = req.query.answers;
    const answers = convertAnswerString(answersString);

    const weightsString = req.query.weights;
    const weights = convertWeights(weightsString);

    const results = computeResult(answers, weights);

    if (req.session.passedThreshold) {
        req.session.finished = true;
    }
        
    res.render('omat-result', { title: TITLE, results: results, theses: fetchTheses(), answers: answersString, weights: weightsString, showGiveaway: req.session.finished });
});

module.exports = router
