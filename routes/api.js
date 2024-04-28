const express = require('express')
const fs = require('fs')
const { parse } = require('csv-parse/sync')
const router = express.Router()

require('dotenv').config();

function fetchParties() {
    const data = fs.readFileSync(process.env.PARTIES_FILE, 'utf8');
    const parties = parse(data, { columns: true });

    return parties;
}
const parties = fetchParties();

function fetchTheses() {
    const data = fs.readFileSync(process.env.THESES_FILE, 'utf8');
    const theses = parse(data, { columns: true });

    return theses;
}
const theses = fetchTheses();

router.get('/parties', (req, res) => {
    res.json(parties);
});

router.get('/theses', (req, res) => {
    res.json(theses);
});

module.exports = router;
