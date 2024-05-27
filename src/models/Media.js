const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema(
    {
        name: { type: String, index: { unique: true } },
        value: { type: String }
    },
    {
        timestamps: true,
    }
);

const Media = mongoose.model("medias", schema);

const fetchMediaByName = async (name) => {
    return await Media.findOne({ name });
}

module.exports = {
    fetchMediaByName
}