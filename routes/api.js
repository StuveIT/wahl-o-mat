const express = require('express')
const router = express.Router()

require('dotenv').config();

router.get('/parties', (req, res) => {
    const parties = [
        {
            name: 'Partei 1',
            description: 'Hier könnte ihre Partei stehen!',
            answers: [1, 0, 1, 0],
        }, {
            name: 'Partei 2',
            description: 'Hier könnte ihre Partei stehen!',
            answers: [0, -1, 0, -1],
        }, {
            name: 'Partei 3',
            description: 'Hier könnte ihre Partei stehen!',
            answers: [0, 0, 0, 0],
        }, {
            name: 'Partei 4',
            description: 'Hier könnte ihre Partei stehen!',
            answers: [-1, -1, -1, -1],
        },
    ]

    res.json(parties);
});

module.exports = router;