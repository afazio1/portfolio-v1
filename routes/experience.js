const express = require("express");
const router = express.Router();
const {experienceSchema} = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");
const Experience = require("../models/experience");
const { isLoggedIn, validateExperience } = require("../middleware");
const experience = require("../controllers/experience");
const { route } = require("./education.js");

router.route("/")
    .post(isLoggedIn, validateExperience, catchAsync(experience.create))
    .get(catchAsync(experience.index));

router.get("/new", isLoggedIn, experience.renderNewForm);

router.route("/:id")
    .put(isLoggedIn, validateExperience, catchAsync(experience.update))
    .delete(isLoggedIn, catchAsync(experience.delete));

router.get("/:id/edit", isLoggedIn, catchAsync(experience.renderEditForm));

module.exports = router;