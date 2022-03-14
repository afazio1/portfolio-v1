const express = require("express");
const router = express.Router();
const {educationSchema} = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");
const Education = require("../models/education");
const { isLoggedIn } = require("../middleware");

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

router.post("/", isLoggedIn, validateEducation, catchAsync(async (req, res, next) => {
    const edu = new Education(req.body);
    await edu.save();
    res.redirect("/education");
}));

router.get("/", catchAsync(async (req, res) => {
    const educations = await Education.find({});
    res.render("educations/index", { educations });
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("educations/new");
});
router.put("/:id", validateEducation, catchAsync(async (req, res) => {
    const edu = await Education.findByIdAndUpdate({_id: req.params.id}, req.body);
    res.redirect("/education");

}));

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const edu = await Education.findByIdAndDelete({_id: req.params.id});
    res.redirect("/education");
}));

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const edu = await Education.findById({_id: req.params.id});
    res.render("educations/edit", { edu });
}));

module.exports = router;