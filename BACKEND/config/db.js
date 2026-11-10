const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error("MONGODB_URI is missing in Render Environment!");
        }

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 15000
        });

        console.log("MongoDB Connected Successfully!");
        console.log("Database:", mongoose.connection.name);

    } catch (error) {
        console.error("MongoDB Connection Failed!");
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;