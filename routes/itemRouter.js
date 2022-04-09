const Router = require('express');
const itemController = require('../controllers/itemController');
const checkRole = require("../middleware/checkRoleMiddlerware");
const userRoles = require("../models/userRoles");
const router = new Router();


router.post('/create', checkRole(userRoles.admin), itemController.create);
router.post('/set_category', checkRole(userRoles.admin), itemController.setCategory);
router.post('/get', itemController.getByCategories);
router.get('/get', itemController.getAll);
router.get('/:id', itemController.getOne);


module.exports = router;