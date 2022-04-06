const APIError = require('../error/APIError');
const {CategoryGroup} = require("../models/models");

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
};

module.exports = categoryGroupController;