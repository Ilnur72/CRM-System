const express = require('express');
const genValidator = require('../shared/validator');
const { isLoggedIn, hasRole } = require('../shared/auth');
const schemas = require('../controllers/groups/schemas');
const {postGroup, getGroups, showGroups, updateGroups, deleteGroups, addStudent, removeStudent } = require('../controllers/groups')

const router = express.Router();

const mPostGroup = [isLoggedIn, hasRole(['admin', 'super_admin']), genValidator(schemas.postGroupSchema)]
const mGetGroups = [isLoggedIn]
const mShowGroup = [isLoggedIn]
const mPatchGroup = [isLoggedIn, hasRole(['admin', 'super_admin']),genValidator(schemas.patchGroupSchema)]
const mDeleteGroup = [isLoggedIn, hasRole(['admin', 'super_admin'])]
const mAddStudent = [isLoggedIn, hasRole(['admin', 'super_admin']), genValidator(schemas.postGroupsStudents)]
const mRemoveStudent = [isLoggedIn, hasRole(['admin', 'super_admin'])]

router.post('/groups', mPostGroup, postGroup);
router.get('/groups', mGetGroups, getGroups)
router.get('/groups/:id', mShowGroup, showGroups)
router.patch('/groups/:id', mPatchGroup, updateGroups)
router.delete('/groups/:id', mDeleteGroup, deleteGroups)

//groups_students
router.post('/groups/:id/students/:student_id', mAddStudent, addStudent)
router.delete('/groups/:id/students/:student_id', mRemoveStudent, removeStudent)

module.exports = router;
