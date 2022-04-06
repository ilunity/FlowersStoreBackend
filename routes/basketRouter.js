const Router = require('express');
const basketController = require('../controllers/basketController');
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();


router.post('/addItem', authMiddleware, basketController.addItem);
router.get('/', basketController.getItems);


module.exports = router;