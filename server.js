const express = require('express');
const app = express();

const omatRouter = require('./routes/omat');

// dotenv
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const TITLE = process.env.TITLE || 'Pant-o-Mat';

/* ---------------------------
        Application
--------------------------- */
app.set('view engine', 'ejs'); // view engine
app.use('/filehost', express.static('assets')); // filehost
app.get('/robots.txt', (req, res) => res.sendFile('robots.txt', { root: './' })); // robots.txt

app.get('/', (req, res) => {
    res.render('home', { title: TITLE })
});

app.get('/about', (req, res) => {
    res.render('about', { title: TITLE })
});

// omat
app.use('/omat', omatRouter)

// listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});