const express = require("express");
const router = express.Router();
const {educationSchema} = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");
const Education = require("../models/education");
const { isLoggedIn, validateEducation } = require("../middleware");
const education = require("../controllers/education");

router.route("/")
    .post(isLoggedIn, validateEducation, catchAsync(education.create))
    .get(catchAsync(education.index));

router.get("/new", isLoggedIn, education.renderNewForm);

router.route("/:id")
    .put(isLoggedIn, validateEducation, catchAsync(education.update))
    .delete(isLoggedIn, catchAsync(education.delete));

router.get("/:id/edit", isLoggedIn, catchAsync(education.renderEditForm));

module.exports = router;