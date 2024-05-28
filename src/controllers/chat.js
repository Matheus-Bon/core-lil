const { fetchMediaByName } = require("../models/Media");
const { createOrder, updateOrderById, fetchOrderById } = require("../models/Order");
const { fetchUserByPhone, createUser, updateUserById } = require("../models/User");

const phrases = require("../phrases");

const chat = async (client, message) => {
    const userPhone = message.from.replace(/\D/g, '');
    const from = message.from;
    const content = message.sender.content;

    const user = await fetchUserByPhone(userPhone);
    const userName = user?.name;
    const currentOrderId = user?.current_order_id;
    const chossingAdress = user?.handle_routines.choosing_address;

    let order = await fetchOrderById(currentOrderId);

    if (!user || userName === 'await') {
        const data = { client, from, user, content };
        const stop = await chooseNameRoutine(data);
        if (stop) return;
    }

    if (!order) {
        const data = { client, from, user, content };
        const stop = await sendMenuOrderRoutine(data);

        if (stop) return;

        order = await createOrder(user);
    }


    const isDelivery = order.delivery;
    if (chossingAdress && isDelivery) {

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

const requestAddressRoutine = async ({ client, from }) => {
    const res = await client.sendText(
        from,
        phrases.requestAddress
    );

    if (res.me.status !== 200)
        return true;


    return false;
}

const chooseAddressRoutine = async () => {

}

module.exports = chat;