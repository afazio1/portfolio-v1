const express = require("express");
const app = express();
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const mongoose = require("mongoose");

const Message = require("./models/message");
const Education = require("./models/education");
const Experience = require("./models/experience");
const Project = require("./models/project");
const education = require("./models/education");


mongoose.connect("mongodb://localhost:27017/portfolio", {
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// HOME
app.get("/", (req, res) => {
    res.render("home");
});

// ABOUT
app.get("/about", (req, res) => {
    res.render("about");
});

// EDUCATION
app.post("/education", async (req, res) => {
    const edu = new Education(req.body);
    await edu.save();
    res.redirect("/education");
});

app.get("/education", async (req, res) => {
    const educations = await Education.find({});
    res.render("educations/index", { educations });
});

app.get("/education/new", (req, res) => {
    res.render("educations/new");
});
app.get("/education/:id/edit", (req, res) => {

});

// EXPERIENCE
app.get("/experience", async (req, res) => {
    const experiences = await Experience.find({});
    res.render("experiences/index", { experiences });
});
app.post("/experience", (req, res) => {
    
});
app.get("/experience/new", (req, res) => {
    res.render("experiences/new");
});
app.get("/experience/:id/edit", (req, res) => {
    
});

// PROJECTS
app.get("/projects", (req, res) => {
    res.render("projects");
});

app.get("/projects/:id", (req, res) => {
    res.send("singular project");
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});