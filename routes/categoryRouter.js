const Router = require('express');
const categoryController = require('../controllers/categoryController');
const checkRole = require('../middleware/checkRoleMiddlerware');
const userRoles = require('../models/userRoles');
const router = new Router();


router.post('/create', checkRole(userRoles.admin), categoryController.create);
router.get('/get', categoryController.getAll);
router.get('/getByName', categoryController.getByName);
router.get('/getById', categoryController.getById);


module.exports = router;