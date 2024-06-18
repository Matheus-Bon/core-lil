const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema(
    {
        company_name: { type: String },

    },
    {
        timestamps: true,
    }
);

const CS = mongoose.model("client_settings", schema);

const fetchAllClientSettings = async () => {
    return CS.find();
}

module.exports = {
    fetchAllClientSettings
}