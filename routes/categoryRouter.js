const Router = require('express');
const categoryController = require('../controllers/categoryController');
const checkRole = require('../middleware/checkRoleMiddlerware');
const userRoles = require('../models/userRoles');
const router = new Router();


router.post('/create', checkRole(userRoles.admin), categoryController.create);
router.get('/get', categoryController.getAll);
router.get('/get_by_name', categoryController.getByName);
router.get('/get_by_id', categoryController.getById);


module.exports = router;