const Router = require('express');
const basketController = require('../controllers/basketController');
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();


router.post('/add_item', authMiddleware, basketController.addItem);
router.get('/get_all', basketController.getItems);


module.exports = router;