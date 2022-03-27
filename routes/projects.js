const express = require("express");
const router = express.Router();
const { projectSchema } = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");
const Project = require("../models/project");
const { isLoggedIn, validateProject } = require("../middleware");
const projects = require("../controllers/projects");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });


router.route("/")
    .post(isLoggedIn, upload.array("image"), validateProject, catchAsync(projects.create))
    .get(catchAsync(projects.index));

router.get("/new", isLoggedIn, projects.renderNewForm);


router.get("/:id/edit", isLoggedIn, catchAsync(projects.renderEditForm));

router.route("/:id")
    .put(isLoggedIn, validateProject, catchAsync(projects.update))
    .delete(isLoggedIn, catchAsync(projects.delete))
    .get(catchAsync(projects.show));


module.exports = router;