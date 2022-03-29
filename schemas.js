const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.educationSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    link: Joi.string().uri().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null, "").optional()
});

module.exports.experienceSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    employer: Joi.string().required().escapeHTML(),
    link: Joi.string().uri().required().escapeHTML(),
    stack: Joi.string().required().escapeHTML(),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null, "").optional()
});

module.exports.projectSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    shortDescription: Joi.string().required().escapeHTML(),
    longDescription: Joi.string().required().escapeHTML(),
    stack: Joi.string().required().escapeHTML(),
    link: Joi.string().uri().required().escapeHTML(),
    // image: Joi.string().uri().required()
});

