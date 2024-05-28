const mongoose = require("mongoose");
const { Schema } = mongoose;
const { fetchUserByPhone } = require("./User");

const schema = new Schema(
    {
        order_code: { type: String, index: { unique: true } },
        user_id: { type: mongoose.Schema.ObjectId },
        address_id: { type: mongoose.Schema.ObjectId },
        total_price: { type: Number, default: 0 },
        payment_method: { type: String, enum: ['DEBIT', 'CREDIT', 'CASH', 'PIX'] },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'completed', 'canceled'],
            default: 'pending'
        },
        delivery: { type: Boolean, default: true }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("orders", schema);

const createOrder = async (user) => {
    const phone = user.phone;
    const name = await fetchUserByPhone(phone)
        .then(data => data.name.toLowerCase());

    const rmdNmb = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `${name}#${rmdNmb}`;
    const data = { user_id: user.id, order_code: orderCode };

    try {
        const newOrder = await Order.create(data);
        return newOrder;
    } catch (error) {
        await createOrder(user);
    }
}

const updateOrderById = async (id, update) => {
    return await Order.findByIdAndUpdate(
        id,
        update,
        { new: true }
    );
}

const fetchOrderById = async (id) => {
    return await Order.findById(id);
}

module.exports = {
    fetchOrderById,
    updateOrderById,
    createOrder
}