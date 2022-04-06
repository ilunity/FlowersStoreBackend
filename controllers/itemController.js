const uuid = require('uuid');
const path = require('path');
const {Item, CategoryItem, Category, ItemInfo} = require('../models/models');
const APIError = require('../error/APIError');


const itemController = {
    async create(req, res, next) {
        try {
            const {name, price, count, category: categoriesJSON, info: infoJSON} = req.body;
            const {img} = req.files;

            const isAllNecessaryParametersSet = !name || !price || !count;
            if (isAllNecessaryParametersSet) next(APIError.noParameters());

            const isCategorySet = Boolean(categoriesJSON);
            let categoryIds = [];
            if (isCategorySet) {
                const categoryNames = JSON.parse(categoriesJSON);

                for (const categoryName of categoryNames) {
                    const category = await Category.findOne({where: {name: categoryName}});
                    if (category === null) next(APIError.badRequest(`There is no such category: ${categoryName}.`));

                    categoryIds.push(category.id);
                }
            }


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


            if (isCategorySet) {
                for (const categoryId of categoryIds) {
                    await CategoryItem.create({itemId: item.id, categoryId});
                }
            }

            return res.json(item);
        } catch (e) {
            next(APIError.badRequest(e.message));
        }
    },
    async getAll(req, res, next) {
        // todo Возвращать item, только если item.count > 0
        const {categories: categoryNamesJSON, limit = 12, page = 1} = req.query;
        const offset = page * limit - limit;
        const categoryNames = JSON.parse(categoryNamesJSON);

        if (!categoryNames) {
            const {id} = req.params;
            const item = await Item.findAll({limit, offset});

            return res.json(item);
        }

        if (categoryNames) {
            const categoryIds = await Category.findAll({
                attributes: ['id'],
                where: {name: categoryNames},
            });
            if (!categoryIds.length) next(APIError.badRequest("There is no such category"));
            console.log(categoryIds);

            const itemsIds = await CategoryItem.findAll({
                attributes: ['id'],
                where: {CategoryId: categoryIds,}
            });
            if (!itemsIds.length) next(APIError.badRequest("There are no items with these category"));

            const items = await Item.findAndCountAll({
                where: {id: itemsIds},
                limit,
                offset,
            });

            return res.json(items);
        }

        const items = await Item.findAll();
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