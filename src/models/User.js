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
}, { _id: false });

const adresses = new Schema({
    address: { type: String },
    location: {
        lat: { type: String },
        lng: { type: String },
    },
}, { _id: false });

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
        adresses: {
            type: Map,
            of: adresses
        },
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
        adresses: {},
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

const fetchAddressByUserIdAndTitle = async (userId, title) => {
    return await User.findOne(
        {
            _id: userId,
            address: { $elementMatch: { title } }
        }
    );
}

const updateAddress = async (user, lat, lng) => {
    const nickname = user.get('response_history.nickname');
    const address = user.get('response_history.address');

    const location = `${lat.toString()} ${lng.toString()}`;

    user.adresses.set(nickname.address, address);
    user.adresses.set(nickname.location, location);

    await user.save();

    return user;
}

module.exports = {
    updateAddress,
    fetchAddressByUserIdAndTitle,
    updateUserById,
    createUser,
    fetchUserByPhone
}