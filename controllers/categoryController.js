const APIError = require('../error/APIError');
const {Category, CategoryGroup} = require('../models/models');

const categoryController = {
    async create(req, res, next) {
        const {name, groupId, groupName} = req.body;
        if (!name || !(groupName || groupId)) next(APIError.noParameters())


        if (groupId) {
            const categoryGroup = await CategoryGroup.findByPk(groupId);
            if (categoryGroup === null) next(APIError.badRequest("Category group with such id doesn't exist"));

            const category = await Category.create({name, groupId});
            return res.json(category);
        }


        const categoryGroup = await CategoryGroup.findOne({
            attributes: ["id"],
            where: {name: groupName},
        });
        if (categoryGroup === null) next(APIError.badRequest("Category group name doesn't exist"));
        const categoryGroupId = categoryGroup.id;

        const category = await Category.create({name, categoryGroupId});

        return res.json(category);
    },
    async getAll(req, res) {
        const categories = await Category.findAll();
        return res.json(categories);
    },
    async getByName(req, res, next) {
        const {name} = res.query;

        if (!name) next(APIError.noParameters());

        const category = await Category.findOne({
            attributes: ["id"],
            where: {name},
        });

        if (category === null) next(APIError.badRequest("Category name doesn't exists"));

        return res.json(category);
    },
    async getById(req, res, next) {
        const {id} = res.query;

        if (!id) next(APIError.noParameters());

        const category = await Category.findByPk(id);

        if (category === null) next(APIError.badRequest("Category id doesn't exists"));

        return res.json(category);
    },
};

module.exports = categoryController;