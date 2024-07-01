const sendText = require("./utils/sendText");

const main = async (client, app) => {
    app.post('/chat-bot-api/:msgType', async (req, res) => {
        const { from, message } = req.body;
        const type = req.params.msgType

        switch (type) {
            case 'text':
                try {
                    await sendText(
                        client,
                        from,
                        message
                    );
                } catch (error) {
                    const status = error.status;
                    const msg = error.text;
                    return res.status(status).send(msg);
                }
                break;

            default:
                break;
        }

        return res.status(204);
    });
}

module.exports = main;