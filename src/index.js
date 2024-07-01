const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const venom = require('venom-bot');

const chat = require('./controllers/chat');
const connectDB = require('./services/database');
const handleApis = require('./api');

const app = express();

const whitelist = [
    "http://localhost:3030/"
]
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


const start = async (client) => {
    await handleApis(client, app);
    client.onMessage(async (message) => chat(client, message));
}


const PORT = process.env.PORT;
app.listen(PORT, async () => {
    console.log(`Server listening on ${PORT}`);
    await connectDB();

    venom
        .create(
            process.env.SESSION,
            undefined,
            (statusSession, session) => {
                console.log('Status Session: ', statusSession);
                console.log('Session name: ', session);
            },
            {
                debug: process.env.DEBUG === 'true' ? true : false,
                devtools: process.env.DEBUG === 'true' ? true : false
            }
        )
        .then((client) => start(client))
        .catch((erro) => console.log(erro));
});