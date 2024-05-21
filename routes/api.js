const express = require('express')
const router = express.Router()

const fetchParties = require('../utils/parties');
const fetchTheses = require('../utils/theses');

const nodeHtmlToImage = require('node-html-to-image')

require('dotenv').config();

const parties = fetchParties();
const theses = fetchTheses();

router.get('/parties', (req, res) => {
    res.json(parties);
});

router.get('/theses', (req, res) => {
    res.json(theses);
});

module.exports = router;
