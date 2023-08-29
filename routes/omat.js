const express = require('express')
const router = express.Router()

require('dotenv').config();
const TITLE = process.env.TITLE || 'Pant-o-Mat';

// Load theses
const theses = [
    {
        title: 'These 1',
        description: 'Hier könnte ihre These stehen!',
    }, {
        title: 'These 2',
        description: 'Hier könnte ihre These stehen!',
    }, {
        title: 'These 3',
        description: 'Hier könnte ihre These stehen!',
    }, {
        title: 'These 4',
        description: 'Hier könnte ihre These stehen!',
    },
]

router.get('/', (req, res) => {
    const answers = convertAnswerString(req.query.edit);
    const thesisNumber = Number.parseInt(req.query.thesis) - 1;

    res.render('omat', { title: TITLE, theses: theses, answers: answers, current: thesisNumber })
})

router.get('/overview', (req, res) => {
    const answers = convertAnswerString(req.query.edit);
    
    res.render('omat-overview', { title: TITLE, theses: theses, answers: answers })
});

router.get('/result', (req, res) => {
    const answers = convertAnswerString(req.query.answers);
    const weights = convertWeights(req.query.weights);

    res.render('omat-result', { title: TITLE, theses: theses, answers: answers, weights: weights })
});

function convertAnswerString(answerString) {
    if(answerString == null)
        return [];

    const string = answerString.split('');
    const answers = [];
    
    for(let i = 0; i < string.length; i++) {
        switch(string[i]) {
            case '0':
                answers[i] = -1;
                break;
            case '1':
                answers[i] = 0;
                break;
            case '2':
                answers[i] = 1;
                break;
            default:
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