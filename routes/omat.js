const express = require('express')
const router = express.Router()

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

    res.render('omat-result', { title: TITLE, answers: answers, weights: weights })
});

function convertAnswerString(answerString) {
    if(answerString == null)
        return []

    const string = answerString.split('');
    const answers = []

    for (let i = 0; i < string.length; i++) {
        switch(string[i]) {
            case '0': // positive
                answers[i] = 0;
                break;
            case '1': // neutral
                answers[i] = 1;
                break;
            case '2': // negative
                answers[i] = 2;
                break;
            default: // skipped
                answers[i] = null;
                break;
        }
    }

    return answers;
}

function convertWeights(weightsString) {
    if(weightsString == null)
        return []

    const string = weightsString.split('');
    const weigths = []

    for (let i = 0; i < string.length; i++) {
        switch(string[i]) {
            case '1':
                weigths[i] = 1;
                break;
            default:
                weigths[i] = 0;
                break;
        }
    }

    return weigths;
}

module.exports = router
