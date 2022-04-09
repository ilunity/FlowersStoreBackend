const Router = require('express');
const categoryGroupController = require('../controllers/categoryGroupController');
const checkRole = require("../middleware/checkRoleMiddlerware");
const userRoles = require("../models/userRoles");
const router = new Router();


router.post('/create', checkRole(userRoles.admin), categoryGroupController.create);
router.get('/get', categoryGroupController.getAll);
router.get('/get_grouped_categories', categoryGroupController.getWithCategories);


module.exports = router;