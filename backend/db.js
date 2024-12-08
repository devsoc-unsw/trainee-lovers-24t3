const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://kj4c:jxU4y2sycVvDq8Vs@lovers2024.obfdx.mongodb.net/?retryWrites=true&w=majority&appName=Lovers2024";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;