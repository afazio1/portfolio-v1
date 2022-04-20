const Education = require("../models/education");

module.exports.index = async (req, res) => {
    const educations = await Education.find({}).sort({ endDate: 1 });
    res.render("educations/index", { educations });
}

module.exports.create = async (req, res, next) => {
    const edu = new Education(req.body);
    await edu.save();
    res.redirect("/education");
}

module.exports.renderNewForm = (req, res) => {
    res.render("educations/new");
}

module.exports.update = async (req, res) => {
    const edu = await Education.findByIdAndUpdate({ _id: req.params.id }, req.body);
    res.redirect("/education");

}

module.exports.delete = async (req, res) => {
    const edu = await Education.findByIdAndDelete({ _id: req.params.id });
    res.redirect("/education");
}
module.exports.renderEditForm = async (req, res) => {
    const edu = await Education.findById({ _id: req.params.id });
    res.render("educations/edit", { edu });
}