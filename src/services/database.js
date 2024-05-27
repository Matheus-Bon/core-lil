const mongoose = require('mongoose');

const connectDB = async () =>
    mongoose.connect(
        process.env.URI,
    )
        .then((db) => {
            console.log('Database connected');
            return db
        })
        .catch((err) => console.log(err));


module.exports = connectDB;
