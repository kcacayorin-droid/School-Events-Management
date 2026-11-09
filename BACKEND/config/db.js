
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
});

        console.log("MongoDB Connected Successfully!");
        console.log("Database:", mongoose.connection.name);

    } catch (error) {
    console.error("MongoDB Connection Failed!");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Cause:", error.cause?.message);
    console.error("Details:", error.reason);
    process.exit(1);
}
};

module.exports = connectDB;
