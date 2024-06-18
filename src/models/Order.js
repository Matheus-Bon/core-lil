const mongoose = require("mongoose");
const { Schema } = mongoose;
const { fetchUserByPhone, updateUserById } = require("./User");

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

const generateOrderCode = () => {
    const now = Date.now().toString();
    const randomPart = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return (now.slice(-4) + randomPart).slice(-6);
}

const createOrder = async (user) => {
    const orderCode = generateOrderCode();
    const data = { user_id: user.id, order_code: orderCode };

    try {
        console.log('ON')
        const newOrder = await Order.create(data);

        await updateUserById(
            user._id,
            { $set: { "current_order_id": newOrder._id } }
        )
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