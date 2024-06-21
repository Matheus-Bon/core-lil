const sendList = async (client, from, title, subTitle, description, btnText, list) => {
    await client.sendListMenu(from, title, subTitle, description, btnText, list)
        .then(res => res.me.status)
        .catch(err => err.me.status);
}

module.exports = sendList;