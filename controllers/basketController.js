const {BasketItem, Basket} = require('../models/models');

const basketController = {
    async addItem(req, res, next) {
        // todo передавать количество
        const {itemId} = req.body;
        const userId = req.user.id;

        const basketId = await Basket.findOne({where: {userId}}).id;
        const basketItem = await BasketItem.create({itemId, basketID: basketId});

        return res.json(basketItem);
    },
    async getItems(req, res, next) {
        const userId = req.user.id;

        const basketId = await Basket.findOne({where: {userId}});
        const userItems = await BasketItem.findAll({
            where: {basketId},
        });

        // todo проверить что возвращает
        return res.json(userItems);
    },
};

module.exports = basketController;