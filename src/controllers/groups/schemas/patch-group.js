const Joi = require("joi");

exports.patchGroupSchema = Joi.object({
  name: Joi.string(),
  teacher_id: Joi.number().integer(),
  assistent_teacher_id: Joi.number().integer(),
});
