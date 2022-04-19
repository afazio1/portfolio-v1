const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");
const User = require("../models/user");
const { isLoggedIn, validateProject } = require("../middleware");
const users = require("../controllers/users");

const passport = require("passport");

// LOGIN
router.route("/login")
    .get(users.index)
    .post(passport.authenticate("local", { failureRedirect: "/login" }), users.loginUser);

router.get("/logout", isLoggedIn, users.logoutUser)

module.exports = router;