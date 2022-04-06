const Router = require('express');
const categoryGroupController = require('../controllers/categoryGroupController');
const checkRole = require("../middleware/checkRoleMiddlerware");
const userRoles = require("../models/userRoles");
const router = new Router();


router.post('/', checkRole(userRoles.admin), categoryGroupController.create);
router.get('/', categoryGroupController.getAll);


module.exports = router;