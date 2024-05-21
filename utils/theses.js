const fs = require('fs');
const { parse } = require('csv-parse/sync');

require('dotenv').config();

function fetchTheses() {
    const data = fs.readFileSync(process.env.THESES_FILE, 'utf8');
    const theses = parse(data, { columns: true });

    return theses;
}

module.exports = fetchTheses;
