import express from 'express';
import config from './const/config';
import pg from 'pg';

const app = express();

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

app.get('/', (req, res) => {
    client.query('SELECT * FROM Users', (err, q_res) => {
        if (err) throw err;
        let result = '';
        for (const row of q_res.rows) {
            result += JSON.stringify(row);
        }
        res.send(result);
    });
});

const port = process.env.PORT || config.port;

app.listen(port, () => {
    console.log('The application is listening on port 3000!');
});
