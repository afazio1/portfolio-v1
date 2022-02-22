const express = require("express");
const app = express();
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const {educationSchema, experienceSchema} = require("./schemas.js")
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

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

// BACKEND FORM VALIDATION FUNCTIONS
const validateEducation = (req, res, next) => {
    const {error} = educationSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    }
    else {
        next();
    }
}

const validateExperience = (req, res, next) => {
    const {error} = experienceSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    }
    else {
        next();
    }
}

// HOME
app.get("/", (req, res) => {
    res.render("home");
});

// ABOUT
app.get("/about", (req, res) => {
    res.render("about");
});

// EDUCATION
app.post("/education", validateEducation, catchAsync(async (req, res, next) => {
    const edu = new Education(req.body);
    await edu.save();
    res.redirect("/education");
}));

app.get("/education", catchAsync(async (req, res) => {
    const educations = await Education.find({});
    res.render("educations/index", { educations });
}));

app.get("/education/new", (req, res) => {
    res.render("educations/new");
});
app.put("/education/:id", validateEducation, catchAsync(async (req, res) => {
    await Education.findByIdAndUpdate({_id: req.params.id}, req.body);
    res.redirect("/education");

}));

app.delete("/education/:id", catchAsync(async (req, res) => {
    await Education.findByIdAndDelete({_id: req.params.id});
    res.redirect("/education");
}));

app.get("/education/:id/edit", catchAsync(async (req, res) => {
    const edu = await Education.findById({_id: req.params.id});
    res.render("educations/edit", { edu });
}));

// EXPERIENCE
app.post("/experience", validateExperience, catchAsync(async (req, res) => {
    let {title, employer, link, stack, startDate, endDate} = req.body;
    stack = stack.split(",");
    const newExp = {
        title: title,
        employer: employer,
        link: link,
        stack: stack,
        startDate: startDate,
        endDate: endDate
    }
    const exp = new Experience(newExp);
    await exp.save();
    res.redirect("/experience");
}));

app.get("/experience", catchAsync(async (req, res) => {
    const experiences = await Experience.find({});
    console.log(experiences);
    res.render("experiences/index", { experiences });
}));

app.get("/experience/new", (req, res) => {
    res.render("experiences/new");
});
app.put("/experience/:id", validateExperience, catchAsync(async (req, res) => {
    let {title, employer, link, stack, startDate, endDate} = req.body;
    stack = stack.split(",");
    const newExp = {
        title: title,
        employer: employer,
        link: link,
        stack: stack,
        startDate: startDate,
        endDate: endDate
    }

    await Experience.findByIdAndUpdate({_id: req.params.id}, newExp);
    res.redirect("/experience");

}));
app.delete("/experience/:id", catchAsync(async (req, res) => {
    await Experience.findByIdAndDelete({_id: req.params.id});
    res.redirect("/experience");
}));

app.get("/experience/:id/edit", catchAsync(async (req, res) => {
    const exp = await Experience.findById({_id: req.params.id});
    res.render("experiences/edit", { exp });
}));

// PROJECTS
app.get("/projects", (req, res) => {
    res.render("projects");
});

app.get("/projects/:id", (req, res) => {
    res.send("singular project");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Something went wrong.";
    res.status(statusCode).render("error", { err });

})
app.listen(3000, () => {
    console.log("Serving on port 3000");
});