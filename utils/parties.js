const { parse } = require('csv-parse/sync')
const fs = require('fs');

require('dotenv').config();

function fetchParties() {
    const data = fs.readFileSync(process.env.PARTIES_FILE, 'utf8');
    const parties = parse(data, { columns: true });

    return parties;
}

module.exports = fetchParties;
