const {BasketItem, Basket, Item} = require('../models/models');
const APIError = require('../error/APIError');

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
        const userItemsRelations = await BasketItem.findAll({
            where: {basketId},
        });

        if (!userItemsRelations.length) next(APIError.badRequest("The basket is empty"));
        const itemsId = userItemsRelations.map(relation => relation.itemId);

        const items = Item.findAll({
            where: {id: itemsId},
        });

        return res.json(items);
    },
};

module.exports = basketController;