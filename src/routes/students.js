const express = require('express');
const genValidator = require("../shared/validator")
const { isLoggedIn, hasRole } = require('../shared/auth');
const schemas = require('../controllers/students/schemas');
const {getStudents, showStudents, postStudent, patchStudent, deleteStudent } = require('../controllers/students')

const mGetStudents = [isLoggedIn, hasRole(['super_admin', 'admin'])]
const mShowStudents = [isLoggedIn, hasRole(['super_admin', 'admin'])]
const mPostStudent = [isLoggedIn, genValidator(schemas.postStudentSchema)]
const mPatchStudent = [isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.patchStudent)]
const mDeleteStudent = [isLoggedIn, hasRole(['super_admin', 'admin'])]

const router = express.Router()

router.get('/students', mGetStudents, getStudents)
router.get('/students/:id', mShowStudents, showStudents)
router.post('/students', mPostStudent, postStudent)
router.patch('/students/:id', mPatchStudent, patchStudent )
router.delete('/students/:id', mDeleteStudent, deleteStudent)

module.exports = router;