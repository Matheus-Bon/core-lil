const { fetchMediaByName } = require("../models/Media");
const { createOrder, updateOrderById, fetchOrderById } = require("../models/Order");
const { fetchUserByPhone, createUser, updateUserById } = require("../models/User");

const sendText = require("../utils/sendText");

const phrases = require("../phrases");


const chat = async (client, message) => {
    const userPhone = message.from.replace(/\D/g, '');
    const from = message.from;
    const content = message.body;

    const user = await fetchUserByPhone(userPhone);
    const choosingAddress = user?.handle_routines.choosing_address;
    const addressRoutine = user?.handle_routines.address_routine;
    const currentOrderId = user?.current_order_id;
    const userName = user?.name;
    const userId = user?._id;

    console.log('user ', user)
    console.log('currentOrderId ', currentOrderId)


    if (!user || userName === 'await') {
        const data = { client, from, user, content, userPhone };
        const stop = await chooseNameRoutine(data);
        if (stop) return;
    } else if (user && !currentOrderId) {
        const text = `Olá, ${userName}! Seja bem vindo novamente!`;
        await sendText(
            client,
            from,
            text
        );
    }

    if (!currentOrderId) {
        const data = { client, from, user, content, currentOrderId };
        const stop = await sendMenuOrderRoutine(data);
        if (stop) return;

        await sendText(
            client,
            from,
            phrases.isDelivery
        );

        return;
    }

    if (addressRoutine) {
        const data = { client, from, content, user };
        const stop = await chooseAddressRoutine(data);
        if (stop) return;
    }
}

const chooseNameRoutine = async ({ client, from, user, content, userPhone }) => {
    if (!user) {
        const text = phrases.chooseName;
        await client.sendText(from, text);
        await createUser(userPhone);
        return true;
    }

    const userName = user.name;
    if (userName === 'await') {
        const update = { $set: { name: content } }
        await updateUserById(user._id, update);
        return false;
    }
}

const sendMenuOrderRoutine = async ({ client, from, user, content, currentOrderId }) => {

    if (!currentOrderId) {
        await createOrder(user);
    }

    if (content === '1') {
        /* const mediaValue = await fetchMediaByName('menu')
            .then(data => data.value); */

        await client.sendImage(
            from,
            "https://i.ibb.co/HFJHd4J/Captura-de-tela-de-2024-06-16-13-32-51.png",
            "test-filename",
            phrases.doTheOrder
        );

    }

    if (content === '2') {
        await createOrder(user);
        return false;
    }

    const choices = ['1', '2'];
    if ((!currentOrderId || !content) && !choices.includes(content)) {
        await client.sendText(
            from,
            phrases.menuOrder
        );
    }

    return true;
}

const chooseAddressRoutine = async ({ client, from, content, user }) => {
    const userId = user._id;
    const addresses = user.address;
    const orderId = user.current_order_id;
    const choosingAddress = user.handle_routines.choosingAddress;
    const numberQuestionAddress = user.handle_routines.number_question_address;

    const choices = ['1', '2'];
    if (choices.includes(content)) {
        return await chooseIfDelivery({ content, user, client, from });
    }

}

const chooseIfDelivery = async ({ content, user, client, from }) => {
    const orderId = user.current_order_id;
    const userId = user._id;

    if (content === '2') {
        await Promise.all([
            updateOrderById(orderId, { $set: { "delivery": false } }),
            updateUserById(userId, { $set: { "handle_routines.address_routine": false } })
        ]);

        return false;
    }


    await sendText(
        client,
        from,
        phrases.requestTitleAddress
    );

    return true;
}

module.exports = chat;