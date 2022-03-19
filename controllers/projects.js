const Project = require("../models/project");

module.exports.index = async (req, res) => {
    const projects = await Project.find({});
    res.render("projects/index", {projects});
}

module.exports.create = async (req, res) => {
    let {name, shortDescription, longDescription, stack, link, image} = req.body;
    stack = stack.split(",");
    const newProj = {
        name: name,
        shortDescription: shortDescription,
        longDescription: longDescription,
        stack: stack,
        link: link,
        image: image
    }
    const proj = new Project(newProj);
    await proj.save();
    res.redirect("/projects");
}

module.exports.renderNewForm = (req, res) => {
    res.render("projects/new");
}

module.exports.update = async (req, res) => {
    let {name, shortDescription, longDescription, stack, link, image} = req.body;
    stack = stack.split(",");
    const newProj = {
        name: name,
        shortDescription: shortDescription,
        longDescription: longDescription,
        stack: stack,
        link: link,
        image: image
    }

    const proj = await Project.findByIdAndUpdate({_id: req.params.id}, newProj);
    res.redirect(`/projects`);
}

module.exports.renderEditForm = async (req, res) => {
    const proj = await Project.findById({_id: req.params.id});
    res.render("projects/edit", { proj });
}

module.exports.delete = async (req, res) => {
    const proj = await Project.findByIdAndDelete({_id: req.params.id});
    res.redirect("/projects");
}

module.exports.show = async (req, res) => {
    const proj = await Project.findById({_id: req.params.id});
    res.render("projects/show", { proj });
}