const express = require("express");
const Activity = require("../models/Activity");

const router = express.Router();

// GET ALL ACTIVITIES
router.get("/", async (req, res) => {
    try {
        const activities = await Activity.find().sort({ date: 1 });
        return res.status(200).json(activities);
    } catch (error) {
        console.error("GET ACTIVITIES ERROR:", error.message);
        return res.status(500).json({
            message: "Failed to retrieve activities."
        });
    }
});

// ADD ACTIVITY
router.post("/add", async (req, res) => {
    try {
        const { title, description, date, location, organizer } = req.body;

        if (!title || !date || !location) {
            return res.status(400).json({
                message: "Title, date, and location are required."
            });
        }

        const newActivity = new Activity({
            title,
            description,
            date,
            location,
            organizer
        });

        await newActivity.save();

        return res.status(201).json({
            message: "Activity added successfully!",
            activity: newActivity
        });
    } catch (error) {
        console.error("ADD ACTIVITY ERROR:", error.message);
        return res.status(500).json({
            message: "Failed to add activity."
        });
    }
});

// EDIT ACTIVITY
router.put("/:id", async (req, res) => {
    try {
        const { title, description, date, location, organizer } = req.body;

        const updatedActivity = await Activity.findByIdAndUpdate(
            req.params.id,
            { title, description, date, location, organizer },
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            return res.status(404).json({
                message: "Activity not found."
            });
        }

        return res.status(200).json({
            message: "Activity updated successfully!",
            activity: updatedActivity
        });
    } catch (error) {
        console.error("EDIT ACTIVITY ERROR:", error.message);
        return res.status(500).json({
            message: "Failed to update activity."
        });
    }
});

// DELETE ACTIVITY
router.delete("/:id", async (req, res) => {
    try {
        const deletedActivity = await Activity.findByIdAndDelete(req.params.id);

        if (!deletedActivity) {
            return res.status(404).json({
                message: "Activity not found."
            });
        }

        return res.status(200).json({
            message: "Activity deleted successfully!"
        });
    } catch (error) {
        console.error("DELETE ACTIVITY ERROR:", error.message);
        return res.status(500).json({
            message: "Failed to delete activity."
        });
    }
});

module.exports = router;