const Project = require("../models/project");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const projects = await Project.find({});
    res.render("projects/index", { projects });
}

module.exports.create = async (req, res) => {
    let { name, shortDescription, longDescription, stack, link, image } = req.body;
    stack = stack.split(",");
    const newProj = {
        name,
        shortDescription,
        longDescription,
        stack,
        link,
        images: req.files.map(f => ({ url: f.path, filename: f.filename }))
    }
    const proj = new Project(newProj);
    await proj.save();
    res.redirect("/projects");
}

module.exports.renderNewForm = (req, res) => {
    res.render("projects/new");
}

module.exports.update = async (req, res) => {
    let { name, shortDescription, longDescription, stack, link } = req.body;
    stack = stack.split(",");
    const newProj = {
        name,
        shortDescription,
        longDescription,
        stack,
        link
    }
    const proj = await Project.findByIdAndUpdate({ _id: req.params.id }, newProj);
    let newImg = req.files.map(f => ({ url: f.path, filename: f.filename }));
    proj.images.push(...newImg);
    await proj.save();

    res.redirect(`/projects/${proj._id}`);
}

module.exports.renderEditForm = async (req, res) => {
    const proj = await Project.findById({ _id: req.params.id });
    res.render("projects/edit", { proj });
}

module.exports.delete = async (req, res) => {
    const proj = await Project.findByIdAndDelete({ _id: req.params.id });
    for (img of proj.images) {
        await cloudinary.uploader.destroy(img.filename);
    }
    res.redirect("/projects");
}

module.exports.show = async (req, res) => {
    const proj = await Project.findById({ _id: req.params.id });
    res.render("projects/show", { proj });
}