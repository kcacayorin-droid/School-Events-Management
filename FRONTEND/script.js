
const API_URL = "http://127.0.0.1:5000/api/auth";
const EVENTS_URL = "http://127.0.0.1:5000/api/events";

// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                window.location.href = "login.html";
            }
        } catch (error) {
            console.error("REGISTER ERROR:", error);
            alert("Cannot connect to server.");
        }
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userName", data.name);
                window.location.href = "index.html";
            }
        } catch (error) {
            console.error("LOGIN ERROR:", error);
            alert("Cannot connect to server.");
        }
    });
}

// DASHBOARD USER
const userName = localStorage.getItem("userName");
const token = localStorage.getItem("token");

const userNameDisplay = document.getElementById("userName");
const welcomeName = document.getElementById("welcomeName");

if (userNameDisplay) {
    if (!token) {
        window.location.href = "login.html";
    } else {
        userNameDisplay.textContent = userName || "Student";

        if (welcomeName) {
            welcomeName.textContent = userName || "Student";
        }
    }
}

// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");

        alert("Logged out successfully!");
        window.location.href = "login.html";
    });
}

// DASHBOARD NAVIGATION
document.getElementById("viewEventsBtn")?.addEventListener("click", function() {
    document.getElementById("eventsSection")?.scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("manageEventsBtn")?.addEventListener("click", function() {
    document.getElementById("manageSection")?.scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("activitiesBtn")?.addEventListener("click", function() {
    document.getElementById("activitiesSection")?.scrollIntoView({
        behavior: "smooth"
    });
});

// EVENT ELEMENTS
const eventForm = document.getElementById("eventForm");
const eventList = document.getElementById("eventList");
const searchEvent = document.getElementById("searchEvent");

// LOAD AND DISPLAY EVENTS
async function loadEvents() {
    if (!eventList) return;

    try {
        const response = await fetch(EVENTS_URL);

        if (!response.ok) {
            throw new Error("Failed to load events. Status: " + response.status);
        }

        const events = await response.json();

        eventList.replaceChildren();

        if (!Array.isArray(events) || events.length === 0) {
            eventList.textContent = "No events available yet.";
            return;
        }

        const searchText = searchEvent
            ? searchEvent.value.toLowerCase().trim()
            : "";

        const filteredEvents = events.filter(function(event) {
            const title = (event.title || "").toLowerCase();
            const location = (event.location || "").toLowerCase();

            return title.includes(searchText) ||
                   location.includes(searchText);
        });

        if (filteredEvents.length === 0) {
            eventList.textContent = "No matching events found.";
            return;
        }

        filteredEvents.forEach(function(event) {
            const card = document.createElement("div");
            card.className = "event-card";

            const title = document.createElement("h3");
            title.textContent = event.title || "Untitled Event";

            const description = document.createElement("p");
            description.textContent =
                "Description: " + (event.description || "No description");

            const date = document.createElement("p");
            date.textContent = "Date: " + (
                event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "No date"
            );

            const location = document.createElement("p");
            location.textContent =
                "Location: " + (event.location || "Not specified");

            const organizer = document.createElement("p");
            organizer.textContent =
                "Organizer: " + (event.organizer || "Not specified");

            // EDIT BUTTON
            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit Event";

            editBtn.addEventListener("click", async function() {
                const newTitle = prompt("Enter new event title:", event.title || "");
                if (newTitle === null || !newTitle.trim()) return;

                const newDescription = prompt(
                    "Enter new description:",
                    event.description || ""
                );
                if (newDescription === null) return;

                const newDate = prompt(
                    "Enter new date (YYYY-MM-DD):",
                    event.date ? event.date.substring(0, 10) : ""
                );
                if (newDate === null || !newDate.trim()) return;

                const newLocation = prompt(
                    "Enter new location:",
                    event.location || ""
                );
                if (newLocation === null || !newLocation.trim()) return;

                const newOrganizer = prompt(
                    "Enter new organizer:",
                    event.organizer || ""
                );
                if (newOrganizer === null) return;

                try {
                    const response = await fetch(`${EVENTS_URL}/${event._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            title: newTitle.trim(),
                            description: newDescription,
                            date: newDate,
                            location: newLocation.trim(),
                            organizer: newOrganizer
                        })
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        alert(data.message || "Failed to update event.");
                        return;
                    }

                    alert("Event updated successfully!");
                    loadEvents();

                } catch (error) {
                    console.error("EDIT EVENT ERROR:", error);
                    alert("Cannot connect to server.");
                }
            });

            // DELETE BUTTON
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete Event";

            deleteBtn.addEventListener("click", async function() {
                if (!confirm("Are you sure you want to delete this event?")) {
                    return;
                }

                try {
                    const response = await fetch(`${EVENTS_URL}/${event._id}`, {
                        method: "DELETE"
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        alert(data.message || "Failed to delete event.");
                        return;
                    }

                    alert("Event deleted successfully!");
                    loadEvents();

                } catch (error) {
                    console.error("DELETE EVENT ERROR:", error);
                    alert("Cannot connect to server.");
                }
            });

            card.append(
                title,
                description,
                date,
                location,
                organizer,
                editBtn,
                deleteBtn
            );

            eventList.appendChild(card);
        });

    } catch (error) {
        console.error("LOAD EVENTS ERROR:", error);
        eventList.textContent = "Unable to load events.";
    }
}

// SEARCH EVENTS
if (searchEvent) {
    searchEvent.addEventListener("input", loadEvents);
}

// ADD NEW EVENT
if (eventForm) {
    eventForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const title = document.getElementById("eventTitle").value;
        const description = document.getElementById("eventDescription").value;
        const date = document.getElementById("eventDate").value;
        const location = document.getElementById("eventLocation").value;
        const organizer = document.getElementById("eventOrganizer").value;

        try {
            const response = await fetch(`${EVENTS_URL}/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    description,
                    date,
                    location,
                    organizer
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to add event.");
                return;
            }

            alert("Event added successfully!");
            eventForm.reset();

            if (searchEvent) {
                searchEvent.value = "";
            }

            loadEvents();

        } catch (error) {
            console.error("ADD EVENT ERROR:", error);
            alert("Cannot connect to server.");
        }
    });
}

// INITIAL LOAD
loadEvents();
