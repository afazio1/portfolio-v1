const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    stack: {
        type: [String],
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Project', ProjectSchema);