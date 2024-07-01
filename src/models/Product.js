const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema(
    {
        name: { type: String },
        description: { type: String },
        category: { type: String, unique: true },
        image: { type: String },
        price: { type: Number },
        active: { type: Boolean, default: true }
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("products", schema);