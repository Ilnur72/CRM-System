const express = require('express');
const genValidator = require('../shared/validator');
const controllers = require('../controllers/groups');
const { isLoggedIn, hasRole } = require('../shared/auth');
const schemas = require('../controllers/groups/schemas');

const router = express.Router();

router.post(
  '/groups',
  isLoggedIn,
  hasRole(['admin', 'super_admin']),
  genValidator(schemas.postGroupSchema),
  controllers.postGroup
);
router.get('/groups', isLoggedIn, hasRole(['admin', 'super_admin']), controllers.getGroups)
router.get('/groups/:id', isLoggedIn, hasRole(['admin', 'super_admin']), controllers.showGroups)
router.patch('/groups/:id', isLoggedIn, hasRole(['admin', 'super_admin']),genValidator(schemas.patchGroupSchema), controllers.updateGroups)
router.delete('/groups/:id', isLoggedIn, hasRole(['admin', 'super_admin']), controllers.deleteGroups)

//groups_students
router.get('/groups/:id/students', isLoggedIn, hasRole(['admin', 'super_admin']), controllers.getGroupsStudents)
router.post('/groups/:id/students/:student_id', isLoggedIn, hasRole(['admin', 'super_admin']), genValidator(schemas.postGroupsStudents), controllers.postGoupsStudents)

module.exports = router;
