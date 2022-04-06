const Router = require('express');
const categoryController = require('../controllers/categoryController');
const checkRole = require('../middleware/checkRoleMiddlerware');
const userRoles = require('../models/userRoles');
const router = new Router();


router.post('/', checkRole(userRoles.admin), categoryController.create);
router.get('/', categoryController.getAll);


module.exports = router;