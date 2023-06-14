const Joi = require('joi');

exports.postDirection = Joi.object({
    name: Joi.string().valid('Dasturlash', 'Dizayn', 'Grafika').required()
})