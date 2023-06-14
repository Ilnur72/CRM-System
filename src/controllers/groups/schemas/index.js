const { postGroupSchema } = require('./post-group');
const { postGroupsStudents } = require('./post-groups-students');
const { patchGroupSchema } = require('./patch-group');

module.exports = {
  postGroupSchema,
  patchGroupSchema,
  postGroupsStudents
};
