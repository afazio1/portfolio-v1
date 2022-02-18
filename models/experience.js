const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
    title: {
        type: String,
        required: true
    }, 
    employer: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    stack: {
        type: [String],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date
});

module.exports = mongoose.model('Experience', ExperienceSchema);