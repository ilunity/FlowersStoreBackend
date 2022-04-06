const Router = require('express');
const itemRouter = require('./itemRouter');
const categoryRouter = require('./categoryRouter');
const categoryGroupRouter = require('./categoryGroupRouter');
const userRouter = require('./userRouter');
const basketRouter = require('./basketRouter');
const router = new Router();


router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/category_group', categoryGroupRouter);
router.use('/item', itemRouter);
router.use('/basket', basketRouter);


module.exports = router;