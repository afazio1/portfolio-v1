const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EducationSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date
});

module.exports = mongoose.model('Education', EducationSchema);