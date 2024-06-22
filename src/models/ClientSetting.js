const mongoose = require("mongoose");
const { Schema } = mongoose;

const operatingDays = new Schema({


})

const schema = new Schema(
    {
        company_name: { type: String, required: true },
        owner: { type: String, required: true },
        company_config: {
            working: { type: Boolean, default: false },
            operating_days: {
                type: Map,
                of: new Schema({
                    open: { type: String, required: true },
                    close: { type: String, required: true }
                })
            }
        }
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