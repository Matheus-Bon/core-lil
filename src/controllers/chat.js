const { fetchUserByPhone, createUser, updateUserById } = require("../models/User");

const phrases = require("../phrases");

const chat = async (client, message) => {
    const userPhone = message.from.replace(/\D/g, '');
    const from = message.from;
    const content = message.sender.content;

    const user = await fetchUserByPhone(userPhone);
    const userName = user?.name;

    if (!user || userName === 'await') {
        const data = { client, from, user }
        await chooseNameRoutine(data);
        return;
    }

}

const chooseNameRoutine = async ({ client, from, user, content }) => {

    if (!user) {
        const text = phrases.chooseName;
        const result = await client.sendText(from, text);

        if (result.stauts !== 200) {
            console.error(`error - ${result.status}`, result.text);
            await client.sendText(from, phrases.errorMsgToUser);
            return;
        }

        return true;
    }

    const userName = user.name;
    if (userName === 'await') {
        const update = { $set: { name: content } }
        await updateUserById(user._id, update);

        const txt = `Certo, ${content}! Antes de prosseguirmos, seu pedido será para entrega?`

        return true;
    }

}

module.exports = chat;