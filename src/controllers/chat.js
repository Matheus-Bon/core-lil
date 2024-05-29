const { fetchMediaByName } = require("../models/Media");
const { createOrder, updateOrderById, fetchOrderById } = require("../models/Order");
const { fetchUserByPhone, createUser, updateUserById } = require("../models/User");

const phrases = require("../phrases");

const chat = async (client, message) => {
    const userPhone = message.from.replace(/\D/g, '');
    const from = message.from;
    const content = message.sender.content;

    const user = await fetchUserByPhone(userPhone);
    const chossingAdress = user?.handle_routines.choosing_address;
    const addressRoutine = user?.handle_routines.address_routine;
    const userName = user?.name;
    const userId = user?._id;
    let currentOrderId = user?.current_order_id;

    if (!user || userName === 'await') {
        const data = { client, from, user, content };
        const stop = await chooseNameRoutine(data);
        if (stop) return;
    }

    if (!currentOrderId) {
        const data = { client, from, user, content };
        const stop = await sendMenuOrderRoutine(data);

        if (stop) return;

        currentOrderId = await createOrder(user)
            .then(data => data._id);


        await requestAddressRoutine(client, from);
    }

    if (addressRoutine) {
        const data = { client, from, content, currentOrderId, userId, chossingAdress };
        const stop = await chooseAddressRoutine(data);
        if (stop) return;
    }


}

const chooseNameRoutine = async ({ client, from, user, content }) => {
    if (!user) {
        const text = phrases.chooseName;
        const result = await client.sendText(from, text);

        if (result.me.stauts !== 200) {
            return true;
        }

        return false;
    }

    const userName = user.name;
    if (userName === 'await') {
        const update = { $set: { name: content } }
        await updateUserById(user._id, update);

        return false;
    }
}

const sendMenuOrderRoutine = async ({ client, from, user, content }) => {
    if (content === '1') {
        const mediaValue = await fetchMediaByName('menu')
            .then(data => data.value);

        const res = await client.sendImageFromBase64(
            from,
            mediaValue
        );

        if (res.me.status !== 200)
            return true;

        await sendMenuOrderRoutine({ client, from, user, content: null });
    }

    if (content === '2') {
        await createOrder(user);
        return false;
    }

    if (!content) {
        const res = await client.sendText(
            from,
            phrases.menuOrder
        );

        if (res.me.status !== 200)
            return true;
    }

    return false;
}

const requestAddressRoutine = async (client, from) => {
    const res = await client.sendText(
        from,
        phrases.requestAddress
    );

    if (res.me.status !== 200)
        return true;


    return false;
}

const chooseAddressRoutine = async ({ client, from, content, currentOrderId, userId, chossingAdress }) => {

    if (content === '1') {
        
    }

    return false;
}

module.exports = chat;