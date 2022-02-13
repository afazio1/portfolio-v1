const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/education", (req, res) => {
    res.render("education");
});

app.get("/experience", (req, res) => {
    res.render("experience");
});

app.get("/projects", (req, res) => {
    res.send("projects");
});
app.get("/projects/:id", (req, res) => {
    res.send("singular project");
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
});