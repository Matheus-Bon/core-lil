const sendText = async (client, from, text) => {
    await client.sendText(from, text)
        .then(res => res.me.status)
        .catch(err => err.me.status);
}

module.exports = sendText;