const Router = require('express');
const basketController = require('../controllers/basketController');
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();


router.post('/add_item', authMiddleware, basketController.addItem);
router.post('/delete_item', authMiddleware, basketController.deleteItem);
router.post('/set_count', authMiddleware, basketController.setCount);
router.get('/get_all', authMiddleware, basketController.getItems);


module.exports = router;