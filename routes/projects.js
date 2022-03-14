const express = require("express");
const router = express.Router();
const {projectSchema} = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");
const Project = require("../models/project");
const { isLoggedIn } = require("../middleware");

const validateProject = (req, res, next) => {
    const {error} = projectSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400);
    }
    else {
        next();
    }
}

router.post("/", isLoggedIn, validateProject, catchAsync(async (req, res) => {
    let {name, shortDescription, longDescription, stack, link, image} = req.body;
    stack = stack.split(",");
    const newProj = {
        name: name,
        shortDescription: shortDescription,
        longDescription: longDescription,
        stack: stack,
        link: link,
        image: image
    }
    const proj = new Project(newProj);
    await proj.save();
    res.redirect("/projects");
}));

router.get("/", catchAsync(async (req, res) => {
    const projects = await Project.find({});
    res.render("projects/index", {projects});
}));
router.get("/new", isLoggedIn, (req, res) => {
    res.render("projects/new");
});
router.put("/:id", isLoggedIn, validateProject, catchAsync(async (req, res) => {
    let {name, shortDescription, longDescription, stack, link, image} = req.body;
    stack = stack.split(",");
    const newProj = {
        name: name,
        shortDescription: shortDescription,
        longDescription: longDescription,
        stack: stack,
        link: link,
        image: image
    }

    const proj = await Project.findByIdAndUpdate({_id: req.params.id}, newProj);
    res.redirect(`/projects`);
}));

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const proj = await Project.findById({_id: req.params.id});
    res.render("projects/edit", { proj });
}));

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const proj = await Project.findByIdAndDelete({_id: req.params.id});
    res.redirect("/projects");
}));

router.get("/:id", catchAsync(async (req, res) => {
    const proj = await Project.findById({_id: req.params.id});
    res.render("projects/show", { proj });
}));

module.exports = router;