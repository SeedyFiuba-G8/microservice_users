import express from 'express';
import config from './const/config';
import pg from 'pg';

const app = express();
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    query_timeout: 3000,
    statement_timeout: 3000,
});
client.connect((err) => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected');
    }
});

app.get('/users', (req, res) => {
    client.query('SELECT * FROM Users;', (qerr, qres) => {
        if (qerr) {
            res.send('DB is down');
        }
        res.send(qres.rows);
    });
});

const port = process.env.PORT || config.port;

app.listen(port, () => {
    console.log('The application is listening on port 3000!');
});
