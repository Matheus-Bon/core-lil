const sendText = async (client, from, text) =>
    await client.sendText(from, text)


module.exports = sendText;