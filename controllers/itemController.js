const uuid = require('uuid');
const path = require('path');
const {Item, CategoryItem, Category, ItemInfo} = require('../models/models');
const APIError = require('../error/APIError');


const getItemsByCategories = async (next, categoriesId, limit, offset) => {
    const categoryItemsRelations = await CategoryItem.findAll({
        attributes: ['itemId'],
        where: {categoryId: categoriesId},
    });


    if (!categoryItemsRelations.length) next(APIError.badRequest("There are no items with these category"));
    const itemIds = categoryItemsRelations.map(relation => relation.itemId);

    const items = await Item.findAndCountAll({
        where: {id: itemIds},
        limit,
        offset,
    });

    return items;
}

const itemController = {
    async create(req, res, next) {
        try {
            const {name, price, count, category: categoriesJSON, info: infoJSON} = req.body;
            const {img} = req.files;

            const isAllNecessaryParametersSet = !name || !price || !count;
            if (isAllNecessaryParametersSet) next(APIError.noParameters());


            const fileName = uuid.v4() + '.jpg';
            await img.mv(path.resolve(__dirname, "..", "static", fileName));

            const item = await Item.create({name, price, count, img: fileName});


            const isInfoSet = Boolean(infoJSON);
            if (isInfoSet) {
                const info = JSON.parse(infoJSON);

                info.forEach((infoItem) => {
                    ItemInfo.create({
                        title: infoItem.title,
                        description: infoItem.description,
                        itemId: item.id,
                    });
                });
            }

            const isCategorySet = Boolean(categoriesJSON);
            if (isCategorySet) {
                const categoryIds = JSON.parse(categoriesJSON);
                for (const categoryId of categoryIds) {
                    await CategoryItem.create({itemId: item.id, categoryId});
                }
            }

            return res.json(item);
        } catch (e) {
            next(APIError.badRequest(e.message));
        }
    },
    async getByCategories(req, res, next) {
        // todo Возвращать item, только если item.count > 0
        const {categories: categoriesIdJSON} = req.body;
        const {limit = 12, page = 1} = req.query;
        const offset = page * limit - limit;

        let categoriesId;
        try {
            categoriesId = JSON.parse(categoriesIdJSON);
        } catch (error) {
            next(APIError.noParameters());
        }

        const items = await getItemsByCategories(next, categoriesId, limit, offset);

        return res.json(items);
    },
    async getAll(req, res, next) {
        const amount = await Item.count();

        const {limit = amount, page = 1} = req.query;
        const offset = page * limit - limit;

        const items = await Item.findAndCountAll({limit, offset});

        if (items === null) next(APIError.badRequest('There are no items'));
        return res.json(items);
    },
    async getOne(req, res) {
        const {id} = req.params;
        const item = await Item.findOne({
            where: {id},
            include: ItemInfo,
        });

        return res.json(item);
    },
    async setCategory(req, res, next) {
        const {itemId, category: categoryName} = req.body;

        const category = await Category.findOne({where: {name: categoryName}});
        if (category === null) next(APIError.badRequest("There is no such category"));


        const categoryId = category.id;
        const categoryItem = await CategoryItem.create({itemId, categoryId});

        return res.json(categoryItem);
    },
};

module.exports = itemController;