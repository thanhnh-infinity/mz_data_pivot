const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5001;

// Middleware to parse JSON payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

let reportData = {};

// POST Endpoint to receive JSON data from MZ Back-End
app.post("/api/pivot_report", (req, res) => {
    reportData = req.body; 
    console.log("--- Data received:", reportData.report_name);
    console.log("--- Volumn:", reportData.data.length);
    res.status(200).json({ message: "Data received successfully" });
});

// API to serve the stored data to the React app
app.get("/api/get_report_data", (req, res) => {
    res.status(200).json(reportData);
});

// Serve the React app statically from "build" directory
app.use(express.static(path.join(__dirname, "build")));

// Serve React app for all other routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});