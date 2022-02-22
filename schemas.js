const Joi = require("joi");

module.exports.educationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    link: Joi.string().uri().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null, "").optional()
});

module.exports.experienceSchema = Joi.object({
    title: Joi.string().required(),
    employer: Joi.string().required(),
    link: Joi.string().uri().required(),
    stack: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null, "").optional()
})
