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
    const choosingAddress = user?.get('handle_routines.choosing_address');
    const seeMenu = user?.get('handle_routines.see_menu');
    const currentOrderId = user?.get('current_order_id');
    const userName = user?.get('name');
    const userId = user?.get('_id');

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
        await createOrder(user);
    }

    if (seeMenu) {
        const data = { client, from, content };
        const stop = await sendMenuOrderRoutine(data);
        if (stop) return;

        await updateUserById(userId, { "handle_routines.see_menu": false });

        await sendText(
            client,
            from,
            phrases.isDelivery
        );

        return;
    }

    if (choosingAddress) {
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

const sendMenuOrderRoutine = async ({ client, from, content }) => {
    if (content === '1') {
        // const mediaValue = await fetchMediaByName('menu')
        //     .then(data => data.value);

        await client.sendImage(
            from,
            "https://i.ibb.co/HFJHd4J/Captura-de-tela-de-2024-06-16-13-32-51.png",
            "test-filename",
            phrases.doTheOrder
        );
    }

    if (content === '2') {
        return false;
    }

    const choices = ['1', '2'];
    if (!content || !choices.includes(content)) {
        await client.sendText(
            from,
            phrases.menuOrder
        );
    }

    return true;
}

const chooseAddressRoutine = async ({ client, from, content, user }) => {
    const userId = user.get('_id');
    const addresses = user.get('address');
    const orderId = user.get('current_order_id');
    const numberQuestionAddress = user.get('handle_routines.number_question_address');

    const choices = ['1', '2'];
    if (choices.includes(content)) {
        return await chooseIfDelivery({ content, user, client, from });
    }

    console.log('content ', content)
    console.log('numberQuestionAddress ', numberQuestionAddress)

    if (content && numberQuestionAddress === 0) {
        const title = content.replace(" ", "_");
        const update = {
            "adresses": { [title]: {} },
            "response_history": { "chosen_title": title },
            "handle_routines.number_question_address": 1
        }

        await updateUserById(userId, update);

        await sendText(
            client,
            from,
            phrases.requestAddress
        );

        return true;
    }

    if (content && numberQuestionAddress === 1) {
        const chosenTitle = user.get('response_history.chosen_title');
        user.set(`adresses.${chosenTitle}.address`, content)
        user.save();
        
        const update = {
            "handle_routines.number_question_address": 2
        }

        await updateUserById(userId, update);

        await sendText(
            client,
            from,
            phrases.requestLoc
        );

        return true;
    }
}

const chooseIfDelivery = async ({ content, user, client, from }) => {
    const orderId = user.current_order_id;
    const userId = user._id;

    if (content === '2') {
        await Promise.all([
            updateOrderById(orderId, { "delivery": false }),
            updateUserById(userId, { "handle_routines.choosing_address": false })
        ]);

        return false;
    }

    if (!user.get('adresses').size) {
        await sendText(
            client,
            from,
            phrases.requestTitleAddress
        );
    } else {

    }

    return true;
}

module.exports = chat;