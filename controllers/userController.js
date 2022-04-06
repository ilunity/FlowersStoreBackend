const APIError = require('../error/APIError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Basket} = require('../models/models');

function generateJwt(id, email, role) {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    );
}

const userController = {
    async registration(req, res, next) {
        const {email, password, role} = req.body;
        if (!email || !password) return next(APIError.noParameters());

        const candidate = await User.findOne({where: {email}});
        if (candidate) return next(APIError.badRequest("A user with this email already exists"));


        const hashPassword = await bcrypt.hash(password, 5);

        const user = await User.create({email, role, password: hashPassword});
        const basket = await Basket.create({userId: user.id});

        const token = generateJwt(user.id, user.email, user.role);
        return res.json({token});
    },
    async login(req, res, next) {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});
        if (!user) return next(APIError.badRequest("User not found"));

        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) return next(APIError.badRequest('Invalid password'));

        const token = generateJwt(user.id, user.email, user.role);
        return res.json({token});
    },
    async authCheck(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({token});
    },
};

module.exports = userController;