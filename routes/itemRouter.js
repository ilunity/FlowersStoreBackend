const Router = require('express');
const itemController = require('../controllers/itemController');
const checkRole = require("../middleware/checkRoleMiddlerware");
const userRoles = require("../models/userRoles");
const router = new Router();


router.post('/create', itemController.create);
router.post('/setCategory', itemController.setCategory);
router.get('/', itemController.getAll);
router.get('/:id', itemController.getOne);


module.exports = router;