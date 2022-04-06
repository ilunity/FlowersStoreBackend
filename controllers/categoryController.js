const APIError = require('../error/APIError');
const {Category, CategoryGroup} = require('../models/models');

const categoryController = {
    async create(req, res, next) {
        const {name, categoryGroup: categoryGroupName} = req.body;
        if (!name || !categoryGroupName) next(APIError.noParameters())

        const categoryGroup = await CategoryGroup.findOne({
            attributes: ["id"],
            where: {name: categoryGroupName},
        });
        if (categoryGroup === null) next(APIError.badRequest("Category group name doesn't exist"));

        const category = await Category.create({name, categoryGroupId: categoryGroup.id});

        return res.json(category);
    },
    async getAll(req, res) {
        const categories = await Category.findAll();
        return res.json(categories);
    },
};

module.exports = categoryController;