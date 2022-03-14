const express = require("express");
const router = express.Router();
const {experienceSchema} = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");
const Experience = require("../models/experience");
const { isLoggedIn } = require("../middleware");

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

router.post("/", isLoggedIn, validateExperience, catchAsync(async (req, res) => {
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

router.get("/", catchAsync(async (req, res) => {
    const experiences = await Experience.find({});
    res.render("experiences/index", { experiences });
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("experiences/new");
});
router.put("/experience/:id", isLoggedIn, validateExperience, catchAsync(async (req, res) => {
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

    const exp = await Experience.findByIdAndUpdate({_id: req.params.id}, newExp);
    res.redirect("/experience");

}));
router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const exp = await Experience.findByIdAndDelete({_id: req.params.id});
    res.redirect("/experience");
}));

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const exp = await Experience.findById({_id: req.params.id});
    res.render("experiences/edit", { exp });
}));

module.exports = router;