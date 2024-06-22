const mongoose = require("mongoose");
const { Schema } = mongoose;

const responseHistory = new Schema({
    nickname: { type: String },
    address: { type: String }
}, { _id: false });

const handleRoutines = new Schema({
    choosing_address: { type: Boolean, default: true },
    number_question_address: { type: Number, default: 0 },
    see_menu: { type: Boolean, default: true },
    link_sent: { type: Boolean, default: false },

}, { _id: false });

const address = new Schema({
    nickname: { type: String, unique: true },
    address: { type: String },
    location: {
        lat: { type: String },
        lng: { type: String },
    },
});

const credentialsSchema = new Schema({
    email: { type: String },
    password: { type: String }
}, { _id: false });

const schema = new Schema(
    {
        name: { type: String },
        phone: { type: String, maxLength: 13, index: { unique: true } },
        current_order_id: { type: mongoose.Types.ObjectId },
        role: { type: String, enum: ['admin', 'clerk', 'user', 'deliveryMan'] },
        credentials: credentialsSchema,
        adresses: { type: [address], default: [] },
        handle_routines: handleRoutines,
        response_history: responseHistory
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
        role: 'user',
        handle_routines: {},
        response_history: {}
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

const updateAddress = async (user, lat, lng) => {
    const nickname = user.get('response_history.nickname');
    const address = user.get('response_history.address');
    const userId = user.get('_id');

    const update = {
        $push: {
            adresses: {
                nickname,
                address,
                location: { lat, lng }
            }
        }
    }

    return await updateUserById(userId, update);
}

module.exports = {
    updateAddress,
    updateUserById,
    createUser,
    fetchUserByPhone
}