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
                title: { type: String },
                address: { type: String },
                location: { type: String },
            }
        ],
        handle_routines: {
            choosing_address: { type: Boolean, default: false },
            address_routine: { type: Boolean, default: true },
            number_question_address: { type: Number, default: 0 }
        }
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

const fetchAddressByUserIdAndTitle = async (userId, title) => {
    return await User.findOne(
        {
            _id: userId,
            address: { $elementMatch: { title } }
        }
    );
}

module.exports = {
    fetchAddressByUserIdAndTitle,
    updateUserById,
    createUser,
    fetchUserByPhone
}