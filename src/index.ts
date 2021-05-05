import express from 'express';
import config from './const/config';
import pg from 'pg';

const app = express();

app.get('/', (req, res) => {
    res.send('Users microservice');
});

const port = process.env.PORT || config.port;

pg.connect(process.env.DATABASE_URL, (err, client, done) => {
    client.query('SELECT * FROM Users', function (err, result) {
        done();
        if (err) return console.error(err);
        console.log(result.rows);
    });
});

app.listen(port, () => {
    console.log('The application is listening on port 3000!');
});
