const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Activity", activitySchema);