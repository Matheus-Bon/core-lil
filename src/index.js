const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const venom = require('venom-bot');

const chat = require('./controllers/chat');
const connectDB = require('./services/database');

const whitelist = []
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());


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
        .then((client) => {
            client.onMessage(async (message) => chat(client, message))
        })
        .catch((erro) => {
            console.log(erro);
        });
});