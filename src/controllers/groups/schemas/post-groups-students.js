const Joi = require('joi');

exports.postGroupsStudents = Joi.object({
  student_id: Joi.number().integer(),
  group_id: Joi.number().integer(),
});
