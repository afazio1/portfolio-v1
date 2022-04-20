const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

// ImageSchema.virtual("thumbnail").get(function () {
//     return this.url.replace('/upload', '/upload/w_1000');
// })

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },
    stack: {
        type: [String],
        required: true
    },
    liveLink: {
        type: String,
        required: false
    },
    sourceLink: {
        type: String,
        required: false
    },
    images: [ImageSchema]


});

module.exports = mongoose.model('Project', ProjectSchema);