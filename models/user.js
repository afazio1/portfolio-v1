const mongoose = require("mongoose");
const passport = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema();
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);