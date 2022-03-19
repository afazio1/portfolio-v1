const Experience = require("../models/experience");

module.exports.index = async (req, res) => {
    const experiences = await Experience.find({});
    res.render("experiences/index", { experiences });
}
module.exports.create = async (req, res) => {
    let {title, employer, link, stack, startDate, endDate} = req.body;
    stack = stack.split(",");
    const newExp = {
        title: title,
        employer: employer,
        link: link,
        stack: stack,
        startDate: startDate,
        endDate: endDate
    }
    const exp = new Experience(newExp);
    await exp.save();
    res.redirect("/experience");
}
module.exports.renderNewForm = (req, res) => {
    res.render("experiences/new");
}

module.exports.update = async (req, res) => {
    let {title, employer, link, stack, startDate, endDate} = req.body;
    stack = stack.split(",");
    const newExp = {
        title: title,
        employer: employer,
        link: link,
        stack: stack,
        startDate: startDate,
        endDate: endDate
    }

    const exp = await Experience.findByIdAndUpdate({_id: req.params.id}, newExp);
    res.redirect("/experience");

}

module.exports.delete = async (req, res) => {
    const exp = await Experience.findByIdAndDelete({_id: req.params.id});
    res.redirect("/experience");
}

module.exports.renderEditForm = async (req, res) => {
    const exp = await Experience.findById({_id: req.params.id});
    res.render("experiences/edit", { exp });
}

