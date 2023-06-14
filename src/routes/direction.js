const express = require('express');
const genValidator = require('../shared/validator');
const controllers = require('../controllers/direction');
const { isLoggedIn, hasRole } = require('../shared/auth');
const schemas = require('../controllers/direction/schemas');

const router = express.Router()
router.get('/directions', isLoggedIn, hasRole(['admin', 'super_admin']), controllers.getDirections)
router.get('/directions/:id', isLoggedIn, hasRole(['admin', 'super_admin']), controllers.showDirections)
router.post('/directions', isLoggedIn, hasRole(['admin', 'super_admin']), genValidator(schemas.postDirection), controllers.postDirections)
router.patch('/directions/:id', isLoggedIn, hasRole(['admin', 'super_admin']), controllers.patchDirections)
router.delete('/directions/:id', isLoggedIn, hasRole(['admin', 'super_admin']), controllers.deleteDirection)

module.exports = router