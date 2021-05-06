import express from 'express';
import config from './const/config';
import pg from 'pg';

const app = express();
/*
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
*/
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
client.connect((err) => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected');
    }
});

app.get('/', (req, res) => {
    client.query('SELECT * FROM Users;', (qerr, qres) => {
        console.log(qres);
        res.send(JSON.stringify(qres.rows));
    });
});

const port = process.env.PORT || config.port;

app.listen(port, () => {
    console.log('The application is listening on port 3000!');
});
