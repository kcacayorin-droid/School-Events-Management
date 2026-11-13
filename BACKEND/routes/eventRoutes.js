const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to retrieve events."
        });
    }
});

router.post("/add", async (req, res) => {
    try {
        const { title, description, date, location, organizer } = req.body;

        if (!title || !date || !location) {
            return res.status(400).json({
                message: "Please fill in all required fields."
            });
        }

        const newEvent = await Event.create({
            title,
            description,
            date,
            location,
            organizer
        });

        res.status(201).json({
            message: "Event added successfully!",
            event: newEvent
        });

    } catch (error) {
        console.error("ADD EVENT ERROR:", error);
        res.status(500).json({
            message: "Failed to add event."
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        res.json({
            message: "Event deleted successfully!"
        });

    } catch (error) {
        console.error("DELETE EVENT ERROR:", error);
        res.status(500).json({
            message: "Failed to delete event."
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { title, description, date, location, organizer } = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, date, location, organizer },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        res.json({
            message: "Event updated successfully!",
            event: updatedEvent
        });

    } catch (error) {
        console.error("EDIT EVENT ERROR:", error);
        res.status(500).json({
            message: "Failed to update event."
        });
    }
});
module.exports = router;
