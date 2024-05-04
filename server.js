const express = require('express');
const app = express();

const omatRouter = require('./routes/omat');
const apiRouter = require('./routes/api');

// dotenv
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const TITLE = process.env.TITLE || 'Omat';

/* ---------------------------
        Application
--------------------------- */
app.set('view engine', 'ejs'); // view engine
app.use('/filehost', express.static('assets')); //filehost
app.use('/data', express.static('data')); // filehost
app.get('/robots.txt', (req, res) => res.sendFile('robots.txt', { root: './' })); // robots.txt

app.get('/', (req, res) => {
    res.render('home', { title: TITLE })
});

app.get('/%C3%BCber', (req, res) => {
    res.render('about', { title: TITLE })
});

app.get('/datenschutz', (req, res) => {
    res.render('datenschutz', { title: TITLE })
});

app.get('/impressum', (req, res) => {
    res.render('impressum', { title: TITLE })
});

// omat
app.use('/omat', omatRouter);
app.use('/api', apiRouter);

// listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
