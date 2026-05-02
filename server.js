const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const JOBS_FILE = "jobs.json";
const APPLY_FILE = "applications.json";


// ✅ SAFE JSON READER (IMPORTANT FIX)
function readJSON(file) {
    try {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, "[]");
            return [];
        }

        const data = fs.readFileSync(file, "utf8");

        if (!data || !data.trim()) return [];

        return JSON.parse(data);

    } catch (err) {
        console.log("JSON ERROR in", file, err);
        return [];
    }
}


// ✅ SAFE WRITER
function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}


// ---------------- JOBS ----------------

// GET JOBS
app.get("/jobs", (req, res) => {
    res.json(readJSON(JOBS_FILE));
});


// ADD JOB
app.post("/add-job", (req, res) => {

    let jobs = readJSON(JOBS_FILE);

    const job = {
        id: Date.now(),
        title: req.body.title,
        post: req.body.post,
        description: req.body.description,
        skills: req.body.skills,
        salary: req.body.salary || "Not Mentioned",
        experience: req.body.experience || "",
        jobType: req.body.jobType || "Full Time",
        urgent: req.body.urgent || false,
        time: new Date().toLocaleString()
    };

    jobs.push(job);
    writeJSON(JOBS_FILE, jobs);

    res.json({ success: true });
});


// ---------------- APPLICATIONS ----------------

// APPLY JOB
app.post("/apply-job", (req, res) => {

    let apps = readJSON(APPLY_FILE);

    const application = {
        id: Date.now(),
        jobId: req.body.jobId,
        jobTitle: req.body.jobTitle,
        name: req.body.name,
        email: req.body.email,
        education: req.body.education,
        experience: req.body.experience,
        resume: req.body.resume,
        time: new Date().toLocaleString()
    };

    apps.push(application);
    writeJSON(APPLY_FILE, apps);

    res.json({ success: true });
});


// GET APPLICATIONS
app.get("/applications", (req, res) => {
    res.json(readJSON(APPLY_FILE));
});


// START SERVER
app.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
});