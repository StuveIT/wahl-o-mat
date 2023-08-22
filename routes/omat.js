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
    res.render('omat', { title: TITLE, theses: theses, answers: [], current: 0 })
});

router.get('/overview/:answer', (req, res) => {
    const answerString = req.params.answer.split('');
    const answers = [];
    
    for(let i = 0; i < answerString.length; i++) {
        switch(answerString[i]) {
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
    
    res.render('omat-overview', { title: TITLE, theses: theses, answers: answers })
});


module.exports = router