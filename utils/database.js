const pg = require('pg');
const { validate } = require('deep-email-validator');

// dotenv
require('dotenv').config();
POSTGRES_USER = process.env.POSTGRES_USER;
POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
POSTGRES_DB = process.env.POSTGRES_DB;

const client = new pg.Client({
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    host: 'localhost',
    port: 6543
});

client.connect();

const insertEmail = async (session_id, email) => {
    const { valid } = await validate({
        email,
        validateRegex: true,
        validateMx: false,
        validateTypo: false,
        validateDisposable: false,
        validateSMTP: false
    });

    if (!valid) {
        return false;
    }

    const query = {
        text: 'INSERT INTO emails (id, email) VALUES ($1, $2)',
        values: [session_id, email]
    };

    try {
        await client.query(query);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
}

module.exports = {
    insertEmail
};
