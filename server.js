const express = require('express');
const app = express();

const session = require('express-session');
const filestore = require('session-file-store')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const omatRouter = require('./routes/omat');
const apiRouter = require('./routes/api');

// dotenv
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const TITLE = process.env.TITLE || 'Omat';
const SECRET = process.env.SECRET || 'secret';

/* ---------------------------
        Application
--------------------------- */
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
    },
    store: new filestore({
        path: './data/sessions',
        ttl: 60 * 60 * 24 * 30, // 30 days
        retries: 0,
        reapInterval: 60 * 60 * 24, // 1 day
    })
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

function checkTimeSpent(req, res, next) {
    if (req.session.started) {
        const now = new Date();
        const diff = now - req.session.started;

        // if time spent is more than 30 seconds
        if (diff > 30000) {
            req.session.passedThreshold = true;
        } else {
            req.session.passedThreshold = false;
        }
    }
    next();
}
app.use(checkTimeSpent);

app.set('view engine', 'ejs'); // view engine
app.use('/filehost', express.static('assets')); //filehost
app.use('/data', express.static('data')); // filehost
app.get('/robots.txt', (req, res) => res.sendFile('robots.txt', { root: './' })); // robots.txt


app.get('/', (req, res) => {
    res.render('home', { title: TITLE });
});

/*
app.get('/verlosung', (req, res) => {
    if (!req.session.finished)
        return res.redirect('/');

    res.render('verlosung', { title: TITLE });
});

app.get('/verlosung/success', (req, res) => {
    res.render('verlosung-success', { title: TITLE });
});
*/

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
