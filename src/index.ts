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
    res.send('Users microservice');
});

const port = process.env.PORT || config.port;

client.query('SELECT * FROM Users', (err, res) => {
    if (err) throw err;
    for (const row of res.rows) {
        console.log(JSON.stringify(row));
    }
    client.end();
});

app.listen(port, () => {
    console.log('The application is listening on port 3000!');
});
