const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema(
    {
        name: { type: String },
        phone: { type: String, maxLength: 13, index: { unique: true } },
        current_order_id: { type: mongoose.Types.ObjectId },
        role: { type: String, enum: ['admin', 'clerk', 'user', 'deliveryMan'] },
        credentials: {
            email: { type: String },
            password: { type: String },
        },
        address: [
            {
                street: { type: String },
                discrit: { type: String },
                complement: { type: String },
                location: { type: String },
            }
        ]
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("users", schema);

const fetchUserByPhone = async (phone) => {
    return User.findOne({ phone });
}

const createUser = async (phone) => {
    const newUser = {
        name: 'await',
        phone,
        role: 'user'
    }

    return await User.create(newUser);
}

const updateUserById = async (id, update) => {
    return await User.findByIdAndUpdate(
        id,
        update,
        { new: true }
    )
}

module.exports = {
    updateUserById,
    createUser,
    fetchUserByPhone
}