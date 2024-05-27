const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema(
    {
        order_code: { type: String },
        user_id: { type: mongoose.Schema.ObjectId },
        address_id: { type: mongoose.Schema.ObjectId },
        total_price: { type: Number },
        payment_method: { type: String, enum: ['DEBIT', 'CREDIT', 'CASH', 'PIX'] },
        status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'completed', 'canceled'] },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("orders", schema);