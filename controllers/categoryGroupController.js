const APIError = require('../error/APIError');
const {CategoryGroup, Category} = require("../models/models");

const categoryGroupController = {
    async create(req, res, next) {
        const {name} = req.body;
        if (!name) next(APIError.noParameters());

        const categoryGroup = await CategoryGroup.create({name});
        return res.json(categoryGroup);
    },
    async getAll(req, res) {
        const categoryGroups = await CategoryGroup.findAll();
        return res.json(categoryGroups);
    },
    async getWithCategories(req, res) {
        const groupedCategories = await CategoryGroup.findAll({
            include: Category,
        });

        return res.json(groupedCategories);
    },
};

module.exports = categoryGroupController;